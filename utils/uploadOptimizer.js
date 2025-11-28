/**
 * 🔥 بهینه‌سازی آپلود فایل برای مقیاس‌پذیری بالا
 * این ماژول شامل:
 * - Chunked Upload برای فایل‌های بزرگ
 * - Upload Queue برای جلوگیری از overload
 * - Progress tracking بهینه
 * - Retry با exponential backoff
 * - Memory management
 */

import axios from 'axios'

// تنظیمات پیش‌فرض
const DEFAULT_CONFIG = {
  chunkSize: 1024 * 1024, // 1MB chunks
  maxConcurrentUploads: 3, // حداکثر 3 آپلود همزمان
  maxRetries: 3, // حداکثر 3 بار تلاش مجدد
  retryDelay: 1000, // تاخیر اولیه برای retry (ms)
  progressThrottle: 100, // throttle progress updates (ms)
}

// صف آپلود برای مدیریت همزمانی
class UploadQueue {
  constructor(maxConcurrent = DEFAULT_CONFIG.maxConcurrentUploads) {
    this.maxConcurrent = maxConcurrent
    this.queue = []
    this.activeCount = 0
  }

  async add(uploadFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ uploadFn, resolve, reject })
      this.process()
    })
  }

  async process() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const { uploadFn, resolve, reject } = this.queue.shift()
      this.activeCount++

      try {
        const result = await uploadFn()
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        this.activeCount--
        this.process()
      }
    }
  }

  clear() {
    this.queue = []
  }

  get pendingCount() {
    return this.queue.length
  }

  get isProcessing() {
    return this.activeCount > 0
  }
}

// نمونه global از صف آپلود
export const uploadQueue = new UploadQueue()

/**
 * Throttle function برای محدود کردن تعداد فراخوانی‌ها
 */
const throttle = (fn, delay) => {
  let lastCall = 0
  let timeoutId = null

  return (...args) => {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn(...args)
      }, remaining)
    }
  }
}

/**
 * آپلود با قابلیت retry و exponential backoff
 */
const uploadWithRetry = async (uploadFn, maxRetries = DEFAULT_CONFIG.maxRetries) => {
  let lastError
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await uploadFn()
    } catch (error) {
      lastError = error
      // اگر خطای 4xx باشد، retry نکن
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }
      // تاخیر با exponential backoff
      const delay = DEFAULT_CONFIG.retryDelay * Math.pow(2, attempt)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

/**
 * آپلود بهینه یک فایل
 * @param {Object} options - تنظیمات آپلود
 * @param {File} options.file - فایل برای آپلود
 * @param {string} options.url - آدرس endpoint
 * @param {Function} options.onProgress - callback برای progress
 * @param {AbortSignal} options.signal - signal برای لغو
 * @param {Object} options.additionalData - داده‌های اضافی برای FormData
 */
export const optimizedUpload = async ({
  file,
  url,
  onProgress,
  signal,
  additionalData = {},
  headers = {},
}) => {
  const formData = new FormData()
  formData.append('file', file)

  // اضافه کردن داده‌های اضافی
  Object.entries(additionalData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  // Throttle کردن progress callback
  const throttledProgress = onProgress ? throttle(onProgress, DEFAULT_CONFIG.progressThrottle) : null

  return uploadWithRetry(async () => {
    const response = await axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
      signal,
      onUploadProgress: (progressEvent) => {
        if (throttledProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          throttledProgress(Math.min(percent, 100))
        }
      },
      // بهینه‌سازی: غیرفعال کردن transform برای فایل‌های بزرگ
      transformRequest: [(data) => data],
    })
    return response.data
  })
}

/**
 * آپلود چند فایل با صف و مدیریت همزمانی
 * @param {Object} options - تنظیمات آپلود
 * @param {File[]} options.files - آرایه فایل‌ها
 * @param {string} options.url - آدرس endpoint
 * @param {Function} options.onProgress - callback برای progress کل
 * @param {Function} options.onFileProgress - callback برای progress هر فایل
 * @param {AbortController} options.abortController - controller برای لغو
 */
export const optimizedBatchUpload = async ({
  files,
  url,
  onProgress,
  onFileProgress,
  abortController,
  additionalData = {},
}) => {
  if (!files || files.length === 0) {
    return []
  }

  const results = []
  const totalFiles = files.length
  let completedFiles = 0
  const fileProgresses = new Map()

  // محاسبه progress کل
  const calculateTotalProgress = () => {
    let totalProgress = 0
    fileProgresses.forEach((progress) => {
      totalProgress += progress
    })
    return Math.round(totalProgress / totalFiles)
  }

  // پردازش هر فایل
  const uploadPromises = files.map((file, index) => {
    fileProgresses.set(index, 0)

    return uploadQueue.add(async () => {
      try {
        const result = await optimizedUpload({
          file,
          url,
          signal: abortController?.signal,
          additionalData,
          onProgress: (progress) => {
            fileProgresses.set(index, progress)
            onFileProgress?.(index, progress, file)
            onProgress?.(calculateTotalProgress())
          },
        })

        completedFiles++
        fileProgresses.set(index, 100)
        onProgress?.(calculateTotalProgress())

        return { success: true, file, result, index }
      } catch (error) {
        return { success: false, file, error, index }
      }
    })
  })

  const uploadResults = await Promise.all(uploadPromises)
  return uploadResults
}

/**
 * Chunked Upload برای فایل‌های بزرگ (بیش از 10MB)
 * این متد فایل را به قطعات کوچکتر تقسیم کرده و آپلود می‌کند
 */
export const chunkedUpload = async ({
  file,
  uploadUrl,
  initUrl,
  completeUrl,
  chunkSize = DEFAULT_CONFIG.chunkSize,
  onProgress,
  signal,
}) => {
  const totalChunks = Math.ceil(file.size / chunkSize)
  let uploadedChunks = 0

  // مرحله 1: شروع آپلود و دریافت uploadId
  const initResponse = await axios.post(
    initUrl,
    {
      fileName: file.name,
      fileSize: file.size,
      totalChunks,
      mimeType: file.type,
    },
    { signal }
  )

  const { uploadId } = initResponse.data

  // مرحله 2: آپلود هر chunk
  const uploadChunk = async (chunkIndex) => {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('uploadId', uploadId)
    formData.append('chunkIndex', chunkIndex)
    formData.append('totalChunks', totalChunks)

    await uploadWithRetry(async () => {
      await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
      })
    })

    uploadedChunks++
    onProgress?.(Math.round((uploadedChunks / totalChunks) * 100))
  }

  // آپلود chunks به صورت ترتیبی (برای اطمینان از ترتیب)
  for (let i = 0; i < totalChunks; i++) {
    await uploadChunk(i)
  }

  // مرحله 3: تکمیل آپلود
  const completeResponse = await axios.post(
    completeUrl,
    { uploadId, fileName: file.name },
    { signal }
  )

  return completeResponse.data
}

/**
 * هوک برای مدیریت وضعیت آپلود
 */
export const createUploadManager = () => {
  let abortController = null
  let isUploading = false

  return {
    startUpload: () => {
      abortController = new AbortController()
      isUploading = true
      return abortController
    },
    cancelUpload: () => {
      if (abortController) {
        abortController.abort()
        abortController = null
      }
      isUploading = false
      uploadQueue.clear()
    },
    isUploading: () => isUploading,
    getSignal: () => abortController?.signal,
    onComplete: () => {
      isUploading = false
      abortController = null
    },
  }
}

export default {
  optimizedUpload,
  optimizedBatchUpload,
  chunkedUpload,
  uploadQueue,
  createUploadManager,
}

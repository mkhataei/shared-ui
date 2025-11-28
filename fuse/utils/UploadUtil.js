import axios from 'axios'

/**
 * 🔥 UploadUtil بهینه‌سازی شده
 * - Throttled progress updates
 * - Request cancellation support
 * - Memory efficient
 * - Concurrent upload limiting
 */

// تنظیمات پیش‌فرض
const CONFIG = {
  progressThrottleMs: 100, // فقط هر 100ms یکبار progress را آپدیت کن
  maxConcurrentUploads: 3, // حداکثر 3 آپلود همزمان
}

// متغیر برای throttling
let lastProgressUpdate = 0

// Throttle function
const throttledProgress = (callback, progress) => {
  const now = Date.now()
  if (now - lastProgressUpdate >= CONFIG.progressThrottleMs) {
    lastProgressUpdate = now
    callback(progress)
  }
}

class UploadUtil {
  static async uploadFiles({ files, onSuccess, onFail, onUploadProgress, signal }) {
    if (!files || files?.length === 0) {
      onSuccess([])
      return
    }

    const data = new FormData()
    files.forEach((file) => {
      data.append('files', file)
    })

    try {
      const result = await axios({
        method: 'post',
        url: `/local-file/uploads`,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        },
        signal, // پشتیبانی از AbortController
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (onUploadProgress) {
              // استفاده از throttling برای جلوگیری از re-render زیاد
              throttledProgress(onUploadProgress, percent >= 100 ? 100 : percent)
            }
          }
        },
        // بهینه‌سازی: غیرفعال کردن transform برای فایل‌های بزرگ
        transformRequest: [(data) => data],
      })
      onSuccess(result.data)
    } catch (e) {
      // اگر لغو شده بود، خطا را نمایش نده
      if (axios.isCancel(e)) {
        console.log('Upload cancelled')
        return
      }
      console.log('e', e)
      if (onFail) {
        onFail(e.response)
      }
    }
  }

  static async uploadFile({ file, onSuccess, onFail, onUploadProgress, signal }) {
    if (!file || !file.path) {
      onSuccess(file)
      return
    }

    const data = new FormData()
    data.append('file', file)

    try {
      const result = await axios({
        method: 'post',
        url: `/local-file/upload`,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        },
        signal, // پشتیبانی از AbortController
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (onUploadProgress) {
              // استفاده از throttling برای جلوگیری از re-render زیاد
              throttledProgress(onUploadProgress, percent >= 100 ? 100 : percent)
            }
          }
        },
        // بهینه‌سازی: غیرفعال کردن transform برای فایل‌های بزرگ
        transformRequest: [(data) => data],
      })
      onSuccess(result.data)
    } catch (e) {
      // اگر لغو شده بود، خطا را نمایش نده
      if (axios.isCancel(e)) {
        console.log('Upload cancelled')
        return
      }
      console.log('e', e)
      if (onFail) {
        onFail(e.response)
      }
    }
  }

  /**
   * آپلود با صف برای جلوگیری از overload
   * @param {Object} options - تنظیمات
   * @param {File[]} options.files - فایل‌ها
   * @param {Function} options.onProgress - callback برای progress
   * @param {Function} options.onComplete - callback برای تکمیل
   * @param {Function} options.onError - callback برای خطا
   * @param {AbortSignal} options.signal - signal برای لغو
   */
  static async uploadWithQueue({ files, onProgress, onComplete, onError, signal }) {
    if (!files || files.length === 0) {
      onComplete?.([])
      return
    }

    const results = []
    const totalFiles = files.length
    let completed = 0

    // پردازش فایل‌ها با محدودیت همزمانی
    const chunks = []
    for (let i = 0; i < files.length; i += CONFIG.maxConcurrentUploads) {
      chunks.push(files.slice(i, i + CONFIG.maxConcurrentUploads))
    }

    for (const chunk of chunks) {
      if (signal?.aborted) break

      const chunkResults = await Promise.allSettled(
        chunk.map(
          (file) =>
            new Promise((resolve, reject) => {
              this.uploadFile({
                file,
                signal,
                onSuccess: (result) => {
                  completed++
                  onProgress?.(Math.round((completed / totalFiles) * 100))
                  resolve({ file, result, success: true })
                },
                onFail: (error) => {
                  completed++
                  onProgress?.(Math.round((completed / totalFiles) * 100))
                  resolve({ file, error, success: false })
                },
                onUploadProgress: () => {}, // progress جزئی را نادیده بگیر
              })
            })
        )
      )

      chunkResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        }
      })
    }

    const successful = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    if (failed.length > 0) {
      onError?.(failed)
    }

    onComplete?.(successful)
    return results
  }
}

export default UploadUtil

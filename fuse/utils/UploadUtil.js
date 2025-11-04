import axios from 'axios'

class UploadUtil {
  static async uploadFiles({ files, onSuccess, onFail, onUploadProgress }) {
    if (!files || files?.length === 0) {
      onSuccess([])
      return
    }
    // console.log('files', files)

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
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // console.log('percent', percent)

          if (onUploadProgress) {
            onUploadProgress(percent >= 100 ? 100 : percent)
          }
        },
      })
      onSuccess(result.data)
    } catch (e) {
      console.log('e', e)
      if (onFail) {
        onFail(e.response)
      }
    }
  }

  static async uploadFile({ file, onSuccess, onFail, onUploadProgress }) {
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
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // console.log('percent', percent)

          if (onUploadProgress) {
            onUploadProgress(percent >= 100 ? 100 : percent)
          }
        },
      })
      onSuccess(result.data)
    } catch (e) {
      console.log('e', e)
      if (onFail) {
        onFail(e.response)
      }
    }
  }
}

export default UploadUtil

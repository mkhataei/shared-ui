import axios from 'axios'

class DownloadUtils {
  static downloadFileGet(url, defaultFileName, onStart, onFinish, onFailed) {
    return () => {
      if (onStart) onStart()

      axios({
        method: 'GET',
        url,
        responseType: 'blob',
      })
        .then((response) => {
          if (onFinish) onFinish()

          const fileNameHeader = 'content-disposition'
          // console.log(response.headers, response.headers[fileNameHeader])
          const suggestedFileName =
            response.headers[fileNameHeader] &&
            response.headers[fileNameHeader].split('; ')[1].split('=')[1]
          const effectiveFileName =
            suggestedFileName === undefined ? defaultFileName : suggestedFileName
          // console.log(
          //   `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
          // )

          // Let the user save the file.
          const myUrl = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = myUrl
          link.setAttribute('download', effectiveFileName)
          document.body.appendChild(link)
          link.click()
        })
        .catch(async (error) => {
          if (onFinish) onFinish()

          const statusCode = error?.response?.status
          const responseObj = await error?.response?.data?.text()
          console.error('Could not Download the report from the backend.', statusCode)
          if (onFailed) onFailed(JSON.parse(responseObj || ''))
        })
    }
  }

  static downloadFilePost(url, data, defaultFileName, onStart, onFinish, onFailed) {
    return () => {
      if (onStart) onStart()

      axios({
        method: 'POST',
        url,
        data,
        responseType: 'blob',
      })
        .then((response) => {
          if (onFinish) onFinish()

          const fileNameHeader = 'content-disposition'
          // console.log(response.headers, response.headers[fileNameHeader])
          const suggestedFileName =
            response.headers[fileNameHeader] &&
            response.headers[fileNameHeader].split('; ')[1].split('=')[1]
          const effectiveFileName =
            suggestedFileName === undefined ? defaultFileName : suggestedFileName
          // console.log(
          //   `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
          // )

          // Let the user save the file.
          const myUrl = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = myUrl
          link.setAttribute('download', effectiveFileName)
          document.body.appendChild(link)
          link.click()
        })
        .catch(async (error) => {
          if (onFinish) onFinish()

          const statusCode = error?.response?.status
          const responseObj = await error?.response?.data?.text()
          console.error('Could not Download the report from the backend.', statusCode)
          if (onFailed) onFailed(responseObj)
        })
    }
  }
}

export default DownloadUtils

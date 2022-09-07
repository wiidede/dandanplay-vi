axios.defaults.baseURL = 'https://api.dandanplay.net/api/v2/'
axios.defaults.timeout = 10000

// axios.interceptors.request.use((config) => {
//   return config
// }, (error) => {
//   return Promise.reject(error)
// })

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  const data = response.data
  if (data.success) {
    return data
  }
  else {
    ElNotification.error(data.errorMessage)
    return Promise.reject(data.errorMessage)
  }
}, (error) => {
  ElNotification.error(error.message)
  return Promise.reject(error)
})


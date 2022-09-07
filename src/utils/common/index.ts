export const elNotify = {
  success: (message: string) => {
    ElNotification({
      title: '',
      message,
      type: 'success',
    })
  },
  error: (message: string) => {
    ElNotification({
      title: '',
      message,
      type: 'error',
    })
  },
  warning: (message: string) => {
    ElNotification({
      title: '',
      message,
      type: 'warning',
    })
  },
  info: (message: string) => {
    ElNotification({
      title: '',
      message,
      type: 'info',
    })
  },
}

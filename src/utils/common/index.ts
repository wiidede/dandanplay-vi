import type { IComment, ICommentRaw } from '~/typings/comment'

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

const danNpTypeMap = {
  1: 'scroll',
  4: 'bottom',
  5: 'top',
} as const

export const dandan2nPlayer = (danComment: ICommentRaw) => {
  const [time, type, color] = danComment.p.split(',').map(i => Number(i))
  const npComment: IComment = {
    color: color.toString(16),
    text: danComment.m,
    time,
    type: danNpTypeMap[type as 1 | 4 | 5],
  }
  return npComment
}

import type { ResponseCommon } from './common'

export interface ICommentRaw {
  cid: number
  p: string
  m: string
}

export interface IComment {
  color?: string // 弹幕颜色
  text: string // 弹幕文字
  time: number // 弹幕出现时间
  type?: 'top' | 'bottom' | 'scroll' // 弹幕类型，默认为滚动类型
  isMe?: boolean // 是否是当前用户发送的
  force?: boolean // 是否强制展示该弹幕（弹幕较多，并且是防碰撞模式时，可能会丢弃一部分弹幕）
}

interface ICommentParams {
  from?: number
  withRelated?: boolean
  chConvert?: 0 | 1 | 2
}

export type GetCommentApi = (episodeId: number, params?: ICommentParams) => Promise<ResponseCommon<{
  count: number
  comments: ICommentRaw[]
}>>

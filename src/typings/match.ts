import type { ResponseCommon } from './common'

export interface IMatchParams {
  fileName: string
  fileHash: string
  fileSize: number
  videoDuration?: number
  matchMode?: string
}

export interface IMatch {
  episodeId: number
  animeId: number
  animeTitle: string
  episodeTitle: string
  type: string
  typeDescription: string
  shift: number
}

export type GetMatchApi = (params: IMatchParams) => Promise<ResponseCommon<{
  isMatched: boolean
  matches: IMatch[]
}>>

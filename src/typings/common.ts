export type ResponseCommon<T> = T & {
  errorCode: number
  success: boolean
  errorMessage: string
}

export interface IStream {
  id: string
  name: string
  info: string
  getBlobUrl: () => Promise<string>
  revokeBlobUrl: () => void
}

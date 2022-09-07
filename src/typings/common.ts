export type ResponseCommon<T> = T & {
  errorCode: number
  success: boolean
  errorMessage: string
}

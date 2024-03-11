export type Response<T> = T & {
  errorCode?: number
  success?: boolean
  errorMessage?: string
}

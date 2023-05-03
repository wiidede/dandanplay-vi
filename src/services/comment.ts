import type { GetCommentApi, GetExternalCommentApi } from '~/typings/comment'

export const getCommentApi: GetCommentApi = (episodeId, params) => axios.get(`/comment/${episodeId}`, { params })
export function getCommentUrl(episodeId: number, params: Record<string, string>) {
  return `${axios.defaults.baseURL}/comment/${episodeId}?${new URLSearchParams(params).toString()}`
}
export const getExternalCommentApi: GetExternalCommentApi = url => axios.get('/extcomment', { params: { url } })

import type { GetCommentApi } from '~/typings/comment'

export const getCommentApi: GetCommentApi = (episodeId, params) => axios.get(`/comment/${episodeId}`, { params })

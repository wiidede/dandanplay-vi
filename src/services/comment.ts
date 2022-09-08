import type { GetCommentApi } from '~/typings/comment'

// export const getCommentApi: GetCommentApi = (episodeId, params) => axios.get(`/comment/${episodeId}`, { params })
export const getCommentApi: GetCommentApi = (episodeId, params) => axios.get('/commentMock.json', { params, baseURL: '' })

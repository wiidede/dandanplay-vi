import type { GetMatchApi } from '~/typings/match'

export const getMatchInfoApi: GetMatchApi = data => axios.post('/match', data)

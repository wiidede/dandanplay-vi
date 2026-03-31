import type { CommentResult, ICommentRaw } from '~/typings/comment'
import type { Response } from '~/typings/common'
import type { IMatch } from '~/typings/match'

export function usePlayer(handleCommentResult: ((res: CommentResult) => void) | false) {
  const playerStore = usePlayerStore()
  const { videoInfo, match } = storeToRefs(playerStore)
  const md5 = computed(() => videoInfo.value.md5)

  const getMatchInfo = async (fileHash: string) => {
    playerStore.updateMatchStep('file', 'loading')

    const params: {
      fileName: string
      fileHash: string
      fileSize: number
      videoDuration?: number
      matchMode?: string
    } = {
      fileName: videoInfo.value.name,
      fileHash,
      fileSize: videoInfo.value.size,
    }

    try {
      const { data } = await useDanDanFetch<Response<{
        isMatched: boolean
        matches: IMatch[]
      }>>('/match').post(params).json()

      if (data.value?.success) {
        if (data.value.isMatched && data.value.matches.length > 0) {
          const matchedItem = data.value.matches[0]
          match.value = matchedItem
          playerStore.updateMatchStep('file', 'success', `${matchedItem.animeTitle} - ${matchedItem.episodeTitle}`)
        }
        else if (data.value.matches.length > 0) {
          playerStore.matchFuzzyResults = data.value.matches
          playerStore.updateMatchStep('file', 'error', '找到多个可能结果，请点击选择')
          playerStore.isMatchPanelExpanded = true
        }
        else {
          playerStore.updateMatchStep('file', 'error', '未找到匹配的影片')
          playerStore.isMatchPanelExpanded = true
        }
      }
      else {
        playerStore.updateMatchStep('file', 'error', data.value?.errorMessage || '匹配失败')
        playerStore.isMatchPanelExpanded = true
      }
    }
    catch {
      playerStore.updateMatchStep('file', 'error', '网络请求失败')
      playerStore.isMatchPanelExpanded = true
    }
  }

  const getComment = async (episodeId: number) => {
    playerStore.updateMatchStep('comment', 'loading')

    const params: {
      from?: string
      withRelated?: string
      chConvert?: '0' | '1' | '2'
    } = {
      withRelated: 'true',
    }

    try {
      const { data } = await useDanDanFetch<{
        count: number
        comments: ICommentRaw[]
      }>(`/comment/${episodeId}?${new URLSearchParams(params)}`).json()

      if (data.value && typeof data.value.count === 'number') {
        if (data.value.count > 0) {
          playerStore.commentCount = data.value.count
          playerStore.updateMatchStep('comment', 'success', `共${data.value.count}条弹幕`)
          handleCommentResult && handleCommentResult(data.value)
        }
        else if (data.value.count === 0) {
          playerStore.updateMatchStep('comment', 'error', '该影片暂无弹幕')
          playerStore.isMatchPanelExpanded = true
        }
      }
      else {
        playerStore.updateMatchStep('comment', 'error', '获取弹幕失败')
        playerStore.isMatchPanelExpanded = true
      }
    }
    catch {
      playerStore.updateMatchStep('comment', 'error', '网络请求失败')
      playerStore.isMatchPanelExpanded = true
    }
  }

  watch(md5, (val) => {
    if (val) {
      playerStore.updateMatchStep('md5', 'success', val)
      getMatchInfo(val)
    }
    else if (videoInfo.value.raw) {
      playerStore.updateMatchStep('md5', 'loading')
    }
  }, {
    immediate: true,
  })

  watch(match, (val) => {
    if (val) {
      if (handleCommentResult)
        getComment(val.episodeId)
    }
  })
}

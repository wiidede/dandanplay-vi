import type { CommentResult, ICommentRaw } from '~/typings/comment'
import type { Response } from '~/typings/common'
import type { IMatch } from '~/typings/match'

export async function manualMatchComment(handleCommentResult: ((res: CommentResult) => void) | false) {
  const inputValue = await ElMessageBox.prompt('请输入第三方弹幕站（如A/B/C站）的网址url。', '手动匹配', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^https?:\/\/.+/,
    inputErrorMessage: '无效的网址',
  })
  const { value } = inputValue
  const { data } = await useDanDanFetch<Response<{
    count: number
    comments: ICommentRaw[]
  }>>(`/extcomment/?${new URLSearchParams({
    url: value,
  })}`).json()
  if (data.value)
    handleCommentResult && handleCommentResult(data.value)
}

export async function manualMatchCommentXML(handleCommentResult: ((res: CommentResult) => void) | false) {
  const inputValue = await ElMessageBox.prompt('请输入b站XML格式的字符串', '手动匹配', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  const { value } = inputValue
  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'application/xml')
  // 打印根元素的名称或错误信息
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    elNotify.error('解析XML出错，检查是否是XML格式的字符串')
    return
  }
  const nodeList = Array.from(doc.documentElement.childNodes).filter(node => node.nodeName === 'd')
  const res: CommentResult = {
    count: nodeList.length,
    comments: nodeList.map((node, index) => ({
      cid: index,
      p: ((node as any).attributes.p.value as string).replace(/^(\d+),(\d+),\d+,(\d+),.*$/, '$1,$2,$3,0'),
      m: node.textContent?.trim() || '',
    })),
  }
  handleCommentResult && handleCommentResult(res)
}

export function usePlayer(handleCommentResult: ((res: CommentResult) => void) | false) {
  const playerStore = usePlayerStore()
  const { videoInfo, match } = storeToRefs(playerStore)
  const md5 = computed(() => videoInfo.value.md5)

  const getMatchInfo = async (fileHash: string) => {
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
    const { data } = await useDanDanFetch<Response<{
      isMatched: boolean
      matches: IMatch[]
    }>>('/match').post(params).json()
    if (data.value?.isMatched)
      match.value = data.value.matches[0]

    else
      elNotify.error('匹配失败，请尝试手动匹配')
  }

  const getComment = async (episodeId: number) => {
    const params: {
      from?: string
      withRelated?: string
      chConvert?: '0' | '1' | '2'
    } = {
      withRelated: 'true',
    }
    const { data } = await useDanDanFetch<Response<{
      count: number
      comments: ICommentRaw[]
    }>>(`/comment/${episodeId}?${new URLSearchParams(params)}`).json()
    if (data.value?.count)
      handleCommentResult && handleCommentResult(data.value)

    else if (data.value?.count === 0)
      elNotify.warning('没有匹配到任何弹幕，尝试重新匹配')

    else
      elNotify.error('弹幕匹配失败')
  }

  watch(md5, (val) => {
    if (val) {
      elNotify.info(`Hash计算完成：${val}`)
      getMatchInfo(val)
    }
  }, {
    immediate: true,
  })

  watch(match, (val) => {
    if (val) {
      elNotify.info(`视频匹配成功：${val.animeTitle} - ${val.episodeTitle}`)
      if (handleCommentResult)
        getComment(val.episodeId)
    }
  })
}

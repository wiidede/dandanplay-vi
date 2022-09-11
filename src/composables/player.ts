import type { GetCommentApiReturnType } from '~/typings/comment'

export const usePlayer = (handleCommentResult: (res: GetCommentApiReturnType) => void) => {
  const playerStore = usePlayerStore()
  const { videoInfo, match } = storeToRefs(playerStore)
  const md5 = computed(() => videoInfo.value.md5)

  const getMatchInfo = async (fileHash: string) => {
    const res = await getMatchInfoApi({
      fileName: videoInfo.value.name,
      fileHash,
      fileSize: videoInfo.value.size,
    })
    if (res.isMatched) {
      match.value = res.matches[0]
    }
  }

  const userInputRes = (url: string) => {
    ElMessageBox.prompt(`<span>请手动将<a target="_blank" href="${url}">请求</a>结果复制到此</span>`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '请求',
      dangerouslyUseHTMLString: true,
      customClass: 'input-popper',
      inputType: 'textarea',
      showClose: false,
    }).then(({ value }) => {
      try {
        const res = JSON.parse(value)
        handleCommentResult(res)
      }
      catch (error) {
        userInputRes(url)
        elNotify.error('解析失败')
      }
    }).catch(() => {
      window.open(url, '_blank')
      userInputRes(url)
    })
  }
  const getComment = async (episodeId: number) => {
    const res = await getCommentApi(episodeId, { withRelated: true }).catch(() => {
      elNotify.error('弹幕匹配失败')
      userInputRes(getCommentUrl(episodeId, { withRelated: 'true' }))
    })
    if (res) {
      handleCommentResult(res)
    }
  }

  watch(md5, (val) => {
    if (val) {
      elNotify.info(`Hash计算完成：${val}`)
      getMatchInfo(val)
    }
  }, { immediate: true })
  watch(match, (val) => {
    if (val) {
      elNotify.info(`视频匹配成功：${val.animeTitle} - ${val.episodeTitle}`)
      getComment(val.episodeId)
    }
  })
}

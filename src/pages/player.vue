<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo, match, comments } = storeToRefs(playerStore)
const md5 = computed(() => videoInfo.value.md5)

const commentOption = {
  autoInsert: false,
  persistOptions: true,
}
const player = new NPlayer({
  src: video.value,
  controls: [['play', 'volume', 'time', 'spacer', 'airplay', 'danmaku-settings', 'settings', 'web-fullscreen', 'fullscreen'], ['progress']],
  plugins: [new NPlayerComment(commentOption)],
})
const nPlayerRef = ref<HTMLDivElement>()
onMounted(() => {
  player.mount(nPlayerRef.value)
})
onUnmounted(() => {
  player.dispose()
})

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
const handleResult = (res: Awaited<ReturnType<typeof getCommentApi>>) => {
  if (res.count) {
    comments.value = res.comments.map(dandan2nPlayer)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
    player.danmaku.resetItems(comments.value.sort((a, b) => a.time - b.time))
    player.play()
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
      handleResult(res)
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
    handleResult(res)
  }
}
watch(video, (val) => {
  if (val) {
    player.updateOptions({
      src: val,
    })
  }
})
watch(md5, (val) => {
  if (val) {
    elNotify.info(`Hash计算完成：${val}`)
    getMatchInfo(val)
  }
})
watch(match, (val) => {
  if (val) {
    elNotify.info(`视频匹配成功：${val.animeTitle} - ${val.episodeTitle}`)
    getComment(val.episodeId)
  }
})
</script>

<template>
  <div mx-auto w80vw>
    <template v-if="match">
      <div>{{ match.animeTitle }}</div>
      <div>{{ match.episodeTitle }}</div>
    </template>
    <div ref="nPlayerRef" :class="{ disabled: !match }" class="n-player-container" />
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}
</style>

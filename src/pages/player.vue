<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo, match, comments } = storeToRefs(playerStore)
const md5 = computed(() => videoInfo.value.md5)

const commentOption = {
  autoInsert: false,
}
const player = new NPlayer({
  src: video.value,
  controls: [['play', 'spacer', 'danmaku-settings'], ['progress']],
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
const getComment = async (episodeId: number) => {
  const res = await getCommentApi(episodeId)
  if (res.count) {
    comments.value = res.comments.map(dandan2nPlayer)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
    player.danmaku.resetItems(comments.value.sort((a, b) => a.time - b.time))
    player.play()
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
  <div v-if="match" mx12>
    {{ match.animeTitle }}
  </div>
  <div v-if="match" mx12>
    {{ match.episodeTitle }}
  </div>
  <div flex gap12 mx12>
    <div ref="nPlayerRef" flex-7 :class="{ disabled: !match }" class="n-player-container" />
    <div flex-3 flex-grow-0 h80vh overflow-auto />
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}
</style>

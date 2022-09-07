<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo, match } = storeToRefs(playerStore)
const md5 = computed(() => videoInfo.value.md5)
const getMatchInfo = async () => {
  const res = await getMatchInfoApi({
    fileName: videoInfo.value.name,
    fileHash: videoInfo.value.md5!,
    fileSize: videoInfo.value.size,
  })
  if (res.isMatched)
    match.value = res.matches[0]
}
watch(md5, (val, oldVal) => {
  if (val) {
    ElNotification(`Hash计算完成：${md5.value}`)
    getMatchInfo()
  }
})
watch(match, (val, oldVal) => {
  if (val)
    ElNotification(`弹幕库匹配成功：${match.value?.animeTitle} - ${match.value?.episodeTitle}`)
})
</script>

<template>
  <video v-if="video" ref="video" class="w-full" controls :src="video" />
  <div v-else>
    请先上传视频
  </div>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const { video } = storeToRefs(playerStore)

const playerRef = ref<HTMLVideoElement>()
onMounted(() => {
  playerRef.value!.src = video.value
})

// const handleResult = (res: GetCommentApiReturnType) => {
//   if (res.count) {
//     comments.value = res.comments.map(dandan2nPlayer).sort((a, b) => a.time - b.time)
//     elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
//   }
// }

usePlayer(false)

watch(video, (val) => {
  if (val) {
    playerRef.value!.src = val
  }
})
</script>

<template>
  <player-layout>
    <video ref="playerRef" controls w-full h-full />
  </player-layout>
</template>

<style lang="scss" scoped>

</style>

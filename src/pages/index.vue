<script setup lang="ts">
const router = useRouter()
const playerStore = usePlayerStore()
const { data, post, terminate } = useWebWorker('src/utils/dandanMd5.ts', { type: 'module' })
const { video, videoInfo } = storeToRefs(playerStore)
watch(video, (val, oldVal) => {
  if (val) {
    elNotify.info(`读取文件：${videoInfo.value.name}`)
    post(videoInfo.value.raw)
    router.push('/player')
  }
})
watchEffect(() => {
  if (data.value)
    videoInfo.value.md5 = data.value
})
onUnmounted(() => {
  terminate()
})
</script>

<template>
  <Uploader />
</template>

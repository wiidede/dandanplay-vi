<script setup lang="ts">
import Worker from '~/utils/dandanMd5.ts?worker'

const worker = new Worker()
const router = useRouter()
const playerStore = usePlayerStore()
const { video, videoInfo } = storeToRefs(playerStore)
watch(video, (val) => {
  if (val) {
    elNotify.info(`读取文件：${videoInfo.value.name}`)
    worker.postMessage(videoInfo.value.raw)
    router.push('/player')
  }
})
worker.onmessage = (e) => {
  videoInfo.value.md5 = e.data
}
onUnmounted(() => {
  worker.terminate()
})
</script>

<template>
  <Uploader />
</template>

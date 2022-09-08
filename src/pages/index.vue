<script setup lang="ts">
import Worker from '~/utils/dandanMd5.ts?worker'

const worker = new Worker()
const isWorker = ref(true)
const router = useRouter()
const playerStore = usePlayerStore()
const { video, videoInfo } = storeToRefs(playerStore)
watch(video, (val) => {
  if (val) {
    elNotify.info(`读取文件：${videoInfo.value.name}`)
    videoInfo.value.md5 = ''
    worker.postMessage(videoInfo.value.raw)
    router.push('/player')
    setTimeout(async () => {
      if (!videoInfo.value.md5) {
        elNotify.warning('md5后台计算3s没有响应，开始在主线程计算')
        worker.terminate()
        isWorker.value = false
        videoInfo.value.md5 = await calcDandanMd5(videoInfo.value.raw!)
      }
    }, 3000)
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

<script setup lang="ts">
import Worker from '~/workers/dandanMd5.ts?worker'

const worker = new Worker()
const router = useRouter()
const settingsStore = useSettingsStore()
const { player } = storeToRefs(settingsStore)
const playerStore = usePlayerStore()
const { video, videoInfo } = storeToRefs(playerStore)
watch(video, (val) => {
  if (val) {
    elNotify.info(`读取文件：${videoInfo.value.name}`)
    videoInfo.value.md5 = ''
    worker.postMessage(videoInfo.value.raw)
    router.push(player.value)
    setTimeout(async () => {
      if (!videoInfo.value.md5) {
        elNotify.warning('md5后台计算3s没有响应，开始在主线程计算')
        worker.terminate()
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
  <Uploader mx-auto w-80vw />
</template>

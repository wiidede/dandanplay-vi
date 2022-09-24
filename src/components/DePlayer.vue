<script setup lang="ts">
import { CommentManager } from '~/libs/CCL'
import '~/libs/CCL.css'
import type { ICommentCCL } from '~/typings/comment'

const props = defineProps<{
  comments?: ICommentCCL[]
}>()
const emit = defineEmits(['play', 'pause'])

const videoContainerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
const commentRef = ref<HTMLDivElement>()

let commentManager: InstanceType<typeof CommentManager>

const { toggle: toggleFullscreen } = useFullscreen(videoContainerRef)
const { idle } = useIdle(2.5 * 1000)
const { pause: pauseTimer, resume: resumeTimer } = useRafFn(() => {
  if (!commentManager) { return }
  commentManager.time(Math.round(videoRef.value!.currentTime * 1000))
}, {
  immediate: false,
})

const playing = ref(false)

onMounted(() => {
  videoRef.value?.addEventListener('play', () => {
    playing.value = true
    commentManager.start()
    resumeTimer()
    emit('play')
  })

  videoRef.value?.addEventListener('pause', () => {
    playing.value = false
    commentManager.stop()
    pauseTimer()
    emit('pause')
  })

  commentManager = new CommentManager(commentRef.value)
  commentManager.init()

  useResizeObserver(commentRef.value, (entries) => {
    commentManager.setBounds()
  })
})

const play = () => {
  videoRef.value?.play()
}

const pause = () => {
  videoRef.value?.pause()
}

const togglePlay = () => {
  playing.value ? pause() : play()
}

watch(() => props.comments, (val) => {
  if (val && val.length) {
    commentManager.clear()
    commentManager.load(val)
    play()
  }
})

defineExpose({
  play,
  pause,
  togglePlay,
})
</script>

<template>
  <div id="my-player" ref="videoContainerRef" class="de-player w-fit h-fit relative flex-center overflow-hidden">
    <video ref="videoRef" v-bind="$attrs" controlslist="nofullscreen" @click="togglePlay" />
    <div id="my-comment-stage" ref="commentRef" class="comment-container" />
    <div
      c="white"
      absolute top-0 bottom-0 right-0 flex-center flex-col transition-300
      :style="{ '--un-translate-x': '100%' }"
      :class="idle ? 'transform' : ''"
    >
      <div :class="playing ? 'i-carbon-pause' : 'i-carbon-play'" cursor-pointer @click="togglePlay" />
      <!-- <div i-carbon-volume-mute cursor-pointer />
      <div i-carbon-volume-down cursor-pointer />
      <div i-carbon-volume-up cursor-pointer /> -->
      <div i-carbon-chat-operational cursor-pointer />
      <div i-carbon-chat cursor-pointer />
      <div i-carbon-chat-off cursor-pointer />
      <div i-carbon-closed-caption cursor-pointer />
      <!-- <div i-carbon-shrink-screen cursor-pointer />
      <div i-carbon-popup cursor-pointer /> -->
      <div i-carbon-fit-to-screen cursor-pointer @click="toggleFullscreen" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

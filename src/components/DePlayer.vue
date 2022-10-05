<script setup lang="ts">
import { omit } from 'lodash-es'
import { CommentManager } from '@/CCL'
import '@/CCL.css'
import type { ICommentCCL } from '~/typings/comment'

const props = defineProps<{
  comments?: ICommentCCL[]
}>()
const emit = defineEmits(['play', 'pause'])

const store = useDePlayerStore()
const { toggleShowComment } = store
const { commentHeight, commentSpeed, showComment } = storeToRefs(store)

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

// play
const playing = ref(false)
const play = () => {
  videoRef.value?.play()
}
const pause = () => {
  videoRef.value?.pause()
}
const togglePlay = () => {
  playing.value ? pause() : play()
}

// comment
watch(() => props.comments, (val) => {
  if (val && val.length) {
    commentManager.clear()
    commentManager.load(val)
    play()
  }
})
const startComment = () => {
  if (showComment.value) {
    commentManager.start()
    resumeTimer()
  }
}
const stopComment = (clear = false) => {
  commentManager.stop()
  clear && commentManager.clear()
  pauseTimer()
}
watch(showComment, (val) => {
  val ? startComment() : stopComment(true)
})
watch(commentSpeed, (val) => {
  commentManager.options.scroll.scale = 1 / val
})

onMounted(() => {
  videoRef.value?.addEventListener('play', () => {
    playing.value = true
    startComment()
    emit('play')
  })
  videoRef.value?.addEventListener('pause', () => {
    playing.value = false
    stopComment()
    emit('pause')
  })

  commentManager = new CommentManager(commentRef.value)
  commentManager.init()

  const width = ref(0)
  const height = ref(0)
  useResizeObserver(commentRef.value, (entries) => {
    const entry = entries[0]
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  watchEffect(() => {
    commentManager.setBounds(width.value, height.value * commentHeight.value / 100)
  })
})

defineExpose({
  play,
  pause,
  togglePlay,
})
</script>

<template>
  <div ref="videoContainerRef" class="de-player relative flex-center overflow-hidden bg-black">
    <video ref="videoRef" v-bind="omit($attrs, 'class', 'style')" controlslist="nofullscreen" class="w-full" @click="togglePlay()" />
    <!-- <div absolute top-0 bottom-0 right-0 left-0 /> -->
    <div ref="commentRef" class="comment-container" />
    <div
      c="white" bg="black op-20" p="y2 x1"
      absolute right-0 flex-center flex-col transition-300 gap-1
      :style="{ '--un-translate-x': '100%' }"
      :class="idle ? 'transform' : ''"
    >
      <div :class="playing ? 'i-carbon-pause' : 'i-carbon-play'" cursor-pointer />
      <!-- <div i-carbon-volume-mute cursor-pointer />
      <div i-carbon-volume-down cursor-pointer />
      <div i-carbon-volume-up cursor-pointer /> -->
      <!-- <div relative>
        <div i-carbon-chat-operational cursor-pointer @click="toggleShowCommentStyle()" />
        <CommentStyle v-show="showCommentStyle" absolute right-6 class="comment-style" />
      </div> -->
      <div cursor-pointer :class="showComment ? 'i-carbon-chat-off' : 'i-carbon-chat'" @click="toggleShowComment()" />
      <el-popover
        placement="left"
        trigger="click"
        width="fit-content"
        popper-class="comment-style-popper"
        :show-arrow="false"
        :teleported="false"
      >
        <template #reference>
          <div i-carbon-chat-operational cursor-pointer />
        </template>
        <CommentStyle />
      </el-popover>
      <div i-carbon-closed-caption />
      <!-- <div i-carbon-shrink-screen cursor-pointer />
      <div i-carbon-popup cursor-pointer /> -->
      <div i-carbon-fit-to-screen cursor-pointer @click="toggleFullscreen()" />
    </div>
  </div>
</template>

<style lang="scss">
.el-popover.comment-style-popper {
  font-size: 12px;
  background-color: #000000;
  color: white;
  opacity: 0.7;
  border: none;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow);
}
</style>

<style lang="scss" scoped>

</style>

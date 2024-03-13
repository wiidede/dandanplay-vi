<script setup lang="ts">
import { usePopperContainerId } from 'element-plus'
import { omit } from 'lodash-es'
import type { ICommentCCL } from '~/typings/comment'

const props = defineProps<{
  comments?: ICommentCCL[]
}>()

const videoContainerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
const commentRef = ref<HTMLDivElement>()

const { playing, currentTime } = useMediaControls(videoRef)
const togglePlay = useToggle(playing)
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(videoContainerRef)
const { idle: systemIdle } = useIdle(3_000)
const idle = computed(() => systemIdle.value && playing.value)

const comments = computed(() => props.comments)
const { showComment, toggleShowComment } = useCCL(commentRef, comments, playing, currentTime)

onMounted(() => {
  // fix tooltip not display while fullscreen
  watch(isFullscreen, (val) => {
    const popperContainer = document.querySelector(usePopperContainerId().selector.value)
    if (!popperContainer)
      return
    if (val)
      videoContainerRef.value?.append(popperContainer)

    else
      document.body.append(popperContainer)
  })
})

defineExpose({
  playing,
  togglePlay,
})
</script>

<template>
  <div
    ref="videoContainerRef"
    class="de-player relative flex-center overflow-hidden bg-black"
    :class="{ 'cursor-none': idle }"
  >
    <video
      ref="videoRef"
      v-bind="omit($attrs, 'class', 'style')"
      controlslist="nofullscreen"
      class="w-full outline-none"
      @click="togglePlay()"
    />
    <!-- <div absolute top-0 bottom-0 right-0 left-0 /> -->
    <div ref="commentRef" class="comment-container" />
    <div
      c="white" bg="black op-20" p="y2 x1"
      absolute right-0 flex-center flex-col gap-1 transition-300
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
        trigger="hover"
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
      <!-- <div i-carbon-closed-caption /> -->
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

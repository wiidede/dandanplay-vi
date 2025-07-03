<script setup lang="ts">
import type { CommentResult } from '~/typings/comment'
import NPlayerComment from '@nplayer/danmaku'
import NPlayer from 'nplayer'

const playerStore = usePlayerStore()
const { video, comments } = storeToRefs(playerStore)

const commentOption = {
  autoInsert: false,
  persistOptions: true,
}
const player = new NPlayer({
  src: video.value,
  controls: [['play', 'volume', 'time', 'spacer', 'airplay', 'danmaku-settings', 'settings', 'web-fullscreen', 'fullscreen'], ['progress']],
  plugins: [new NPlayerComment(commentOption)],
})
const playerRef = ref<HTMLDivElement>()
onMounted(() => {
  player.mount(playerRef.value)
})
onBeforeUnmount(() => {
  player.dispose()
})

function handleResult(res: CommentResult) {
  if (res.count) {
    comments.value = res.comments.map(dandan2nPlayer).sort((a, b) => a.time - b.time)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
    player.danmaku.resetItems(comments.value)
    player.play()
  }
}

usePlayer(handleResult)

watch(video, (val) => {
  if (val) {
    player.updateOptions({
      src: val,
    })
  }
})
</script>

<template>
  <player-layout>
    <div ref="playerRef" h-full w-full />
    <template #action>
      <ActionLayout @manual-match="manualMatchComment(handleResult)" @manual-match-xml="manualMatchCommentXML(handleResult)" />
    </template>
  </player-layout>
</template>

<style scoped>
.disabled {
  pointer-events: none;
}

@media screen and (max-width: 768px) {
  .player-container {
    width: 100vw;
  }
}
</style>

<script setup lang="ts">
import type { CommentResult } from '~/typings/comment'
import ArtPlayer from 'artplayer'
import ArtPlayerComment from 'artplayer-plugin-danmuku'

const playerStore = usePlayerStore()
const { video, comments } = storeToRefs(playerStore)

let player: ArtPlayer
const playerRef = ref<HTMLDivElement>()
onMounted(() => {
  player = new ArtPlayer({
    id: 'artplayer',
    container: playerRef.value!,
    url: video.value,
    autoSize: true,
    aspectRatio: true,
    setting: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    plugins: [
      ArtPlayerComment({
        // 弹幕数组
        danmuku: [],
      }),
    ],
  })
})
onBeforeUnmount(() => {
  player.destroy(false)
})

function handleResult(res: CommentResult) {
  if (res.count) {
    comments.value = res.comments.map(dandan2artPlayer)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
    player.plugins.artplayerPluginDanmuku.config({
      danmuku: comments.value,
    })
    player.plugins.artplayerPluginDanmuku.load()
    player.play()
  }
}

usePlayer(handleResult)

watch(video, (val) => {
  if (val)
    player.switchUrl(val)
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

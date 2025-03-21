<script setup lang="ts">
import type { CommentResult, ICommentCCL } from '~/typings/comment'

const playerStore = usePlayerStore()
const { videoInfo, comments } = storeToRefs(playerStore)
const commentsCCL = computed<ICommentCCL[]>(() => comments.value as ICommentCCL[])

function handleResult(res: CommentResult) {
  if (res.count) {
    comments.value = res.comments.map(dandan2CCL)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
  }
}

usePlayer(handleResult)
</script>

<template>
  <player-layout>
    <dan-player :src="videoInfo.raw" :comments="commentsCCL" autoplay-on-comment-load />
  </player-layout>
  <ActionLayout @manual-match="manualMatchComment(handleResult)" @manual-match-xml="manualMatchCommentXML(handleResult)" />
</template>

<style scoped>

</style>

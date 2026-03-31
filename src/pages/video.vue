<script setup lang="ts">
import type { CommentResult, ICommentCCL } from '~/typings/comment'

const playerStore = usePlayerStore()
const { videoInfo, comments } = storeToRefs(playerStore)
const commentsCCL = computed<ICommentCCL[]>(() => comments.value as ICommentCCL[])

function handleResult(res: CommentResult) {
  if (res.count) {
    comments.value = res.comments.map(dandan2CCL)
  }
}

usePlayer(handleResult)
</script>

<template>
  <player-layout @manual-match-xml="handleResult">
    <dan-player :src="videoInfo.raw" :comments="commentsCCL" autoplay-on-comment-load />
  </player-layout>
</template>

<style scoped>

</style>

<script setup lang="ts">
import DePlayer from '~/components/DePlayer.vue'
import { ICommentCCL } from '~/typings/comment'
import type { GetCommentApiReturnType } from '~/typings/comment'
const playerStore = usePlayerStore()
const { video, comments } = storeToRefs(playerStore)

const playerRef = ref<InstanceType<typeof DePlayer>>()

const handleResult = (res: GetCommentApiReturnType) => {
  if (res.count) {
    comments.value = res.comments.map(dandan2CCL)
    elNotify.info(`弹幕匹配成功：共${res.count}条弹幕`)
  }
}

usePlayer(handleResult)
</script>

<template>
  <player-layout>
    <DePlayer ref="playerRef" :src="video" controls :comments="comments as ICommentCCL[]" />
  </player-layout>
  <ActionLayout @manual-match="manualMatchComment(handleResult)" @manual-match-xml="manualMatchCommentXML(handleResult)" />
</template>

<style lang="scss" scoped>

</style>

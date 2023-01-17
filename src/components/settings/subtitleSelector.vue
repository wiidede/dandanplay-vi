<script setup lang="ts">
import type { IStream } from '~/typings/common'

const emit = defineEmits<{
  (e: 'setSubtitle', subtitle: string): void
}>()

const getVtt = async (subtitle: IStream) => {
  emit('setSubtitle', await subtitle.getBlobUrl())
}

const playerStore = usePlayerStore()
const { videoInfo } = storeToRefs(playerStore)
</script>

<template>
  <ol>
    <li v-for="subtitle in videoInfo.subtitles" :key="subtitle.id" cursor-pointer @click="getVtt(subtitle)">
      {{ subtitle.name }}
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.config-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
}
</style>

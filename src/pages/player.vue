<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo } = storeToRefs(playerStore)
</script>

<template>
  <h1>{{ videoInfo.name }}</h1>
  <video v-if="video" ref="video" class="w-full" controls :src="video" />
  <div v-else>
    请先上传视频
  </div>
</template>

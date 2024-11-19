<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo, match } = storeToRefs(playerStore)

const title = useTitle('弹弹play web版')

onActivated(() => {
  watchEffect(() => {
    title.value = match.value ? `${match.value.episodeTitle} - ${match.value?.animeTitle} - 弹弹play web版` : '弹弹play web版'
  })
})

onDeactivated(() => {
  title.value = '弹弹play web版'
})
</script>

<template>
  <div mx-auto w-80vw class="player-container" :class="{ disabled: !video }">
    <template v-if="match">
      <h1>{{ match.animeTitle }} - {{ match.episodeTitle }}</h1>
    </template>
    <template v-else-if="videoInfo.name">
      <h1>{{ videoInfo.name }}</h1>
    </template>
    <slot />
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.disabled {
  pointer-events: none;
}

@media screen and (max-width: 768px) {
  .player-container {
    width: 100vw;
  }
}
</style>

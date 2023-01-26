<script setup lang="ts">
const playerStore = usePlayerStore()
const { video, videoInfo, match } = storeToRefs(playerStore)

const title = useTitle('DanDanPlayer Vitesse')

onActivated(() => {
  watchEffect(() => {
    title.value = match.value ? `${match.value.episodeTitle} - ${match.value?.animeTitle} - DanDanPlayer Vitesse` : 'DanDanPlayer Vitesse'
  })
})

onDeactivated(() => {
  title.value = 'DanDanPlayer Vitesse'
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

<style lang="scss" scoped>
h1 {
  font-size: 1.2rem;
  margin-bottom: .8rem;
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


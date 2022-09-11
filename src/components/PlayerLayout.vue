<script setup lang="ts">
const playerStore = usePlayerStore()
const { match } = storeToRefs(playerStore)
</script>

<template>
  <div mx-auto w-80vw h-45vw class="player-container" :class="{ disabled: !match }">
    <template v-if="match">
      <div>{{ match.animeTitle }}</div>
      <div>{{ match.episodeTitle }}</div>
    </template>
    <slot />
  </div>
</template>

  <style lang="scss" scoped>
  .disabled {
    pointer-events: none;
  }

  @media screen and (max-width: 768px) {
    .player-container {
      width: 100vw;
    }
  }
  </style>


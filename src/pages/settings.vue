<script setup lang="ts">
const settingsStore = useSettingsStore()
const { textShadow } = storeToRefs(settingsStore)
const textShadowMap = {
  border: '#000 1px 0 1px, #000 0 1px 1px, #000 0 -1px 1px, #000 -1px 0 1px',
  shadow: 'black 0.1em 0.1em 0.2em',
  none: '0',
} as const
watchEffect(() => {
  if (textShadow.value) {
    document.body.style.setProperty('--comment-text-shadow', textShadowMap[textShadow.value])
  }
})
</script>

<template>
  <div class="n-player-text-shadow" @click="settingsStore.nextTextShadow">
    弹幕样式
  </div>
</template>

<style scoped>
.n-player-text-shadow {
  cursor: pointer;
  text-shadow: var(--comment-text-shadow);
}
</style>

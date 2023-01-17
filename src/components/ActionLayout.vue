<script lang="ts" setup>
const emit = defineEmits(['manualMatch'])

const handleManualMatch = () => {
  emit('manualMatch')
}
</script>

<template>
  <div w-full flex justify-center>
    <div color-gray cursor-pointer @click="handleManualMatch">
      手动匹配
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

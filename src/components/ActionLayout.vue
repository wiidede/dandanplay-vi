<script lang="ts" setup>
const emit = defineEmits(['manualMatch', 'manualMatchXml'])
</script>

<template>
  <div w-full flex justify-center gap-2>
    <div cursor-pointer color-gray @click="emit('manualMatch')">
      手动匹配
    </div>
    <div cursor-pointer color-gray @click="emit('manualMatchXml')">
      手动匹配XML
    </div>
  </div>
</template>

<style scoped>

</style>

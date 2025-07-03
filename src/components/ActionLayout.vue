<script lang="ts" setup>
const emit = defineEmits(['manualMatch', 'manualMatchXml'])
</script>

<template>
  <div class="w-full flex justify-end gap-4">
    <div cursor-pointer color-gray @click="emit('manualMatch')">
      手动匹配
    </div>
    <div cursor-pointer color-gray @click="emit('manualMatchXml')">
      手动添加XML
    </div>
  </div>
</template>

<style scoped>

</style>

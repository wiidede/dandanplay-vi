<script setup lang="ts">
const settingsStore = useSettingsStore()
const { color } = storeToRefs(settingsStore)
const colorList = [
  '#FFBE0B', '#FB5607', '#FF006E',
  '#8338EC', '#3A86FF', '#00F5D4',
  '#99582A', '#FF99C8', '#0353A4',
  '#70E000', '#57CC99', '#464646',
] as const
</script>

<template>
  <div class="setting-item optional-item">
    <span>主题色</span>
    <el-radio-group v-model="color" my2>
      <el-radio
        v-for="c in colorList" :key="c" :label="c" border
        :style="{ color: c }"
      />
      <el-color-picker v-model="color" />
    </el-radio-group>
  </div>
</template>

<style lang="scss" scoped>
.el-radio-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .el-radio {
    margin: 0;
  }
}
</style>


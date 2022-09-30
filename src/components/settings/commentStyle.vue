<script setup lang="ts">
const store = useDePlayerStore()
const { commentOpacity, commentHeight } = storeToRefs(store)

const heightMap = {
  25: '1/4',
  50: '半屏',
  75: '3/4',
  100: '全屏',
}
const heightFormatter = (value: number) => heightMap[value as typeof commentHeight.value]
</script>

<template>
  <div class="config-container w70 p4">
    <div>不透明度</div>
    <el-slider v-model="commentOpacity" :min="10" :max="100" :format-tooltip="val => `${val}%`" />
    <div>显示区域</div>
    <el-slider v-model="commentHeight" :min="25" :max="100" :step="25" :format-tooltip="heightFormatter" :marks="heightMap" />
    <div>弹幕速度</div>
    <el-slider :min="10" :max="100" />
    <div>字体大小</div>
    <el-slider :min="10" :max="100" />
  </div>
</template>

<style lang="scss" scoped>
.config-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  font-size: 12px;
  background-color: #000000;
  color: white;
  opacity: 0.7;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow);
}
:deep(.el-slider) {
  --el-slider-height: 4px;
  --el-slider-button-size: 12px;
  --el-slider-stop-bg-color: #808080;

  .el-slider__runway {
    background-color: #414243;
  }

  .el-slider__button {
    background-color: var(--el-slider-main-bg-color);
  }
  .el-slider__marks-text{
    word-break: keep-all;
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>

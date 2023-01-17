<script setup lang="ts">
const store = useDePlayerStore()
const { commentOpacity, commentHeight, commentWeight, commentShadow, commentSize, commentSpeed } = storeToRefs(store)

const { textShadowLabelMap } = useTextShadow()

const heightMap = {
  25: '1/4',
  50: '半屏',
  75: '3/4',
  100: '全屏',
}
const heightFormatter = (value: number) => heightMap[value as typeof commentHeight.value]
</script>

<template>
  <div class="config-container w70">
    <div>不透明度</div>
    <el-slider v-model="commentOpacity" :min="10" :max="100" :format-tooltip="(val: number) => `${val}%`" />
    <div>显示区域</div>
    <el-slider v-model="commentHeight" :min="25" :max="100" :step="25" :format-tooltip="heightFormatter" :marks="heightMap" />
    <div>弹幕速度</div>
    <el-slider v-model="commentSpeed" :min="0.5" :max="2" :step="0.1" />
    <div>字体大小</div>
    <el-slider v-model="commentSize" :min="10" :max="128" />
    <div>弹幕字重</div>
    <el-slider v-model="commentWeight" :min="100" :max="900" :step="100" />
    <div>弹幕阴影</div>
    <el-radio-group v-model="commentShadow" size="small">
      <el-radio-button v-for="(label, key) in textShadowLabelMap" :key="key" :label="key">
        {{ label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style lang="scss" scoped>
.config-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
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

:deep(.el-radio-button) {
  .el-radio-button__inner {
    --el-text-color-regular: #CFD3DC;
    --el-fill-color-blank: transparent;
  }
}
</style>

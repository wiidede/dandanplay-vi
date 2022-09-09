<script setup lang="ts">
const settingsStore = useSettingsStore()
const { textShadow, textWeight } = storeToRefs(settingsStore)
const textShadowMap = {
  border: '#000 1px 0 1px, #000 0 1px 1px, #000 0 -1px 1px, #000 -1px 0 1px',
  shadow: 'black 0.1em 0.1em 0.2em',
  none: '0',
} as const
const textShadowList = Object.keys(textShadowMap) as (keyof typeof textShadowMap)[]
const textShadowLabelMap = {
  border: '描边',
  shadow: '阴影',
  none: '无',
} as const
const textWeightList = ['lighter', 'normal', 'bold', 'bolder'] as const
const textWeightLabelMap = {
  lighter: '细',
  normal: '正常',
  bold: '粗',
  bolder: '加粗',
} as const
watchEffect(() => {
  if (textShadow.value) {
    document.body.style.setProperty('--comment-text-shadow', textShadowMap[textShadow.value])
  }
})
watchEffect(() => {
  if (textWeight.value) {
    document.body.style.setProperty('--comment-text-weight', textWeight.value)
  }
})
</script>

<template>
  <div class="nplayer_danmaku_item comment-example">
    弹幕样式
  </div>
  <div class="setting-item optional-item">
    <span>弹幕阴影</span>
    <el-radio-group v-model="textShadow">
      <el-radio-button v-for="shadow in textShadowList" :key="shadow" :label="shadow">
        {{ textShadowLabelMap[shadow] }}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="setting-item optional-item">
    <span>弹幕字重</span>
    <el-radio-group v-model="textWeight">
      <el-radio-button v-for="weight in textWeightList" :key="weight" :label="weight">
        {{ textWeightLabelMap[weight] }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.comment-example {
  margin: 6px auto;
  padding: 0 16px;
  width: fit-content;
  min-height: 50px;
  position: static;
  color: white;
  background-color: #808080;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


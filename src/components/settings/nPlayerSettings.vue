<script setup lang="ts">
const settingsStore = useSettingsStore()
const { textShadow, textWeight } = storeToRefs(settingsStore)

const {
  textShadowList,
  textShadowLabelMap,
  textWeightList,
} = useNPlayerSettingsConst()
</script>

<template>
  <div class="nplayer_danmaku_item comment-example">
    弹幕样式
  </div>
  <div class="setting-item optional-item">
    <span>弹幕阴影</span>
    <el-radio-group v-model="textShadow">
      <el-radio v-for="shadow in textShadowList" :key="shadow" :label="shadow" border>
        {{ textShadowLabelMap[shadow] }}
      </el-radio>
    </el-radio-group>
  </div>
  <div class="setting-item optional-item">
    <span>弹幕字重</span>
    <el-radio-group v-model="textWeight">
      <el-radio v-for="weight in textWeightList" :key="weight" :label="weight" border />
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


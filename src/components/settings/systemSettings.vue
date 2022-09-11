<script setup lang="ts">
const settingsStore = useSettingsStore()
const { player, color } = storeToRefs(settingsStore)
const playerList = ['/nplayer', '/artplayer'] as const
const colorList = [
  '#FFBE0B', '#FB5607', '#FF006E',
  '#8338EC', '#3A86FF', '#00F5D4',
  '#99582A', '#FF99C8', '#0353A4',
  '#70E000', '#57CC99', '#464646',
] as const

watch(player, (val) => {
  if (val) {
    setTimeout(() => {
      location.reload()
    }, 10)
  }
})
</script>

<template>
  <div class="setting-item optional-item">
    <span>播放器</span>
    <el-radio-group v-model="player">
      <el-radio v-for="p in playerList" :key="p" :label="p" border>
        {{ p.slice(1) }}
      </el-radio>
    </el-radio-group>
  </div>
  <div class="setting-item optional-item">
    <span>主题色</span>
    <el-radio-group v-model="color">
      <el-radio v-for="c in colorList" :key="c" :label="c" border :style="{ color: c }">
        {{ c.slice(1) }}
      </el-radio>
      <el-color-picker v-model="color" />
    </el-radio-group>
  </div>
</template>

<style lang="scss" scoped>

</style>


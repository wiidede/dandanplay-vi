<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const settingsStore = useSettingsStore()
const { menuList } = storeToRefs(settingsStore)

useSystemSettings()
useNPlayerSettings()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <Header />
  </el-config-provider>
  <main font-sans p="t4 m20" text="gray-700 dark:gray-200">
    <router-view v-slot="{ Component }">
      <keep-alive :include="menuList.map(menu => menu.name)">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>

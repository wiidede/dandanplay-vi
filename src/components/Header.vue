<script lang="ts" setup>
const router = useRouter()
const settingsStore = useSettingsStore()
const { player, menuList } = storeToRefs(settingsStore)

const activeName = ref('/')
watchEffect(() => {
  menuList.value = [
    { label: '首页', name: 'index', path: '/' },
    { label: '播放器', name: player.value.slice(1), path: player.value },
    { label: '设置', name: 'settings', path: '/settings' },
  ]
})

router.afterEach((to) => {
  if (activeName.value !== to.path)
    activeName.value = to.path
})

watch(() => activeName.value, (path) => {
  router.push(path)
})
</script>

<template>
  <header relative flex select-none items-center gap4 p-x-4>
    <router-link to="/" class="flex items-center">
      <div i-the-dandanplay-vi class="me-2 inline-block flex-shrink-0 text-primary" />
      <span class="header-title">弹弹Play Web</span>
    </router-link>
    <el-tabs v-model="activeName" class="header-tabs flex-auto overflow-hidden">
      <el-tab-pane v-for="menu in menuList" :key="menu.name" :label="menu.label" :name="menu.path" />
    </el-tabs>
    <a href="https://www.dandanplay.com/" target="_blank" lt-sm:hidden>
      <button class="flex items-center bg-transparent hover:filter-drop-shadow">
        <div i-the-dandanplay-vi class="me-1 inline-block flex-shrink-0 text-dandan" />
        弹弹play官网
      </button>
    </a>
    <button icon-btn @click="toggleDark()">
      <div i-carbon-sun dark:i-carbon-moon />
    </button>
    <a
      class="flex"
      rel="noreferrer"
      href="https://github.com/wiidede/dandanplay-vi"
      target="_blank"
      title="GitHub"
    >
      <button class="icon-btn">
        <div class="i-carbon-logo-github" />
      </button>
    </a>
  </header>
</template>

<style scoped>
header {
  box-shadow: inset 0 -2px 0 0 var(--el-border-color-light);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  backdrop-filter: saturate(50%) blur(8px);
  background: var(--bg-blur-effect-color);
}

:deep(.header-tabs) .el-tabs__header {
  margin-bottom: 0;
}

:deep(.header-tabs) .el-tabs__nav-wrap {
  margin-bottom: 0;
}

:deep(.header-tabs) .el-tabs__nav-wrap::after {
  display: none;
}

@media screen and (max-width: 768px) {
  .header-title {
    display: none;
  }
}
</style>

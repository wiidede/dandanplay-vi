<script lang="ts" setup>
import { ref } from 'vue'

const router = useRouter()

const activeName = ref('/')
const menuList = [
  { label: '首页', path: '/' },
  { label: '播放器', path: '/player' },
  { label: '设置', path: '/settings' },
]

router.afterEach((to) => {
  if (activeName.value !== to.path) {
    activeName.value = to.path
  }
})

watch(() => activeName.value, (path) => {
  router.push(path)
})
</script>

<template>
  <header flex items-center gap4 p-x-4 select-none>
    <div i-carbon-campsite inline-block />
    <span>Vitesse Player Lite</span>
    <el-tabs v-model="activeName" class="header-tabs flex-auto">
      <el-tab-pane v-for="menu in menuList" :key="menu.path" :label="menu.label" :name="menu.path" />
    </el-tabs>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>
  </header>
</template>

<style lang="scss" scoped>
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

:deep(.header-tabs) {
  .el-tabs {
    &__header {
      margin-bottom: 0;
    }

    &__nav-wrap {
      margin-bottom: 0;

      & ::after {
        display: none;
      }
    }

  }
}
</style>

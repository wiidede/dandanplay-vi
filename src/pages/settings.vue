<script setup>
import Theme from '~/components/settings/theme.vue'
import NPlayerSettings from '~/components/settings/nPlayerSettings.vue'
const settings = [
  { name: '主题', component: Theme },
  { name: 'NPlayer', component: NPlayerSettings },
]
</script>

<template>
  <div class="view-settings">
    <h1>Settings</h1>
    <el-card v-for="setting in settings" :key="setting.name" class="setting-part">
      <h4>{{ setting.name }}</h4>
      <component :is="setting.component" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.view-settings {
  font-size: 16px;
  user-select: none;
  max-width: 720px;
  margin: 0 auto;

  h1 {
    font-size: 32px;
    margin: 20px 16px;
  }
}

.setting-part {
  display: flex;
  flex-direction: column;
  margin: 16px;

  h4 {
    font-size: 20px;
    font-weight: bold;
    margin: 12px 0;
    padding: 0 16px;
  }

  :deep(.setting-item) {
    padding: 0 16px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: var(--transition-theme);

    @media screen and (max-width: 768px) {
      &.optional-item {
        padding: 8px 16px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        gap: 8px;
      }
    }

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}
</style>

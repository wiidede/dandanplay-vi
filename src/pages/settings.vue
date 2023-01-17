<script setup>
import SystemSettings from '~/components/settings/systemSettings.vue'
import NPlayerSettings from '~/components/settings/nPlayerSettings.vue'

const settings = [
  { name: '系统设置', component: SystemSettings },
]
</script>

<template>
  <div class="view-settings">
    <h1>Settings</h1>
    <el-card
      v-for="setting in settings"
      :key="setting.name"
      class="setting-part"
    >
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
    padding: 16px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: var(--transition-theme);

    .el-radio-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      .el-radio {
        margin: 0;
        min-width: 110px;
      }
    }

    .el-color-picker__trigger {
      width: 100%;
    }

    @media screen and (max-width: 768px) {
      .el-radio-group {
        grid-template-columns: repeat(2, 1fr);
      }
    }

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

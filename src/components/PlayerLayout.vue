<script setup lang="ts">
const router = useRouter()

const playerStore = usePlayerStore()
const { video, videoInfo, match } = storeToRefs(playerStore)

const title = useTitle('弹弹play web版')

onActivated(() => {
  watchEffect(() => {
    title.value = match.value ? `${match.value.episodeTitle} - ${match.value?.animeTitle} - 弹弹play web版` : '弹弹play web版'
  })
})

onDeactivated(() => {
  title.value = '弹弹play web版'
})
</script>

<template>
  <div class="container mx-auto mb-4 flex flex-col items-center gap-4">
    <el-alert
      v-if="!video"
      title="前往首页上传本地视频"
      type="info"
      show-icon
      :closable="false"
      class="cursor-pointer"
      @click="router.push('/')"
    />
    <template v-if="match">
      <h1 class="self-start">
        {{ match.animeTitle }} - {{ match.episodeTitle }}
      </h1>
    </template>
    <template v-else-if="videoInfo.name">
      <h1 class="self-start">
        {{ videoInfo.name }}
      </h1>
    </template>
    <div :class="{ disabled: !video }" class="w-full">
      <slot />
    </div>
    <slot name="action" />
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
  font-weight: 500;
}

.disabled {
  pointer-events: none;
}
</style>

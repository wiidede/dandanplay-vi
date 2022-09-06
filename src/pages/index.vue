<script setup lang="ts">
const router = useRouter()
const playerStore = usePlayerStore()
watch(() => playerStore.video, () => {
  router.push('/player')
})
</script>

<template>
  <Uploader />
</template>

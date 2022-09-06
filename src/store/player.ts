export const usePlayerStore = defineStore('play-player', () => {
  const _videoUrl = ref('')

  const video = computed(() => _videoUrl.value)
  const videoInfo = ref({
    name: '',
  })

  const setVideo = (file: File) => {
    _videoUrl.value = URL.createObjectURL(file)
    videoInfo.value.name = file.name
  }
  const clearVideo = () => {
    URL.revokeObjectURL(_videoUrl.value)
    _videoUrl.value = ''
  }

  return { video, videoInfo, setVideo, clearVideo }
})

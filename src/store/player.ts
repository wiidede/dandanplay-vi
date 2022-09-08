import type { IComment } from '~/typings/comment'
import type { IMatch } from '~/typings/match'
export const usePlayerStore = defineStore('play-player', () => {
  const _videoUrl = ref('')

  const video = computed(() => _videoUrl.value)
  const videoInfo = ref<{
    raw: File | undefined
    name: string
    size: number
    md5: string | null
  }>({
    raw: undefined,
    name: '',
    size: 0,
    md5: '',
  })
  const match = ref<IMatch>()
  const comments = ref<IComment[]>([])

  const setVideo = (file: File) => {
    _videoUrl.value = URL.createObjectURL(file)
    videoInfo.value.raw = file
    videoInfo.value.name = file.name
    videoInfo.value.size = file.size
  }
  const clearVideo = () => {
    URL.revokeObjectURL(_videoUrl.value)
    _videoUrl.value = ''
  }

  return { video, videoInfo, match, comments, setVideo, clearVideo }
})
import type { ICommentArt, ICommentCCL, ICommentN } from '~/typings/comment'
import type { IStream } from '~/typings/common'
import type { IMatch } from '~/typings/match'
export const usePlayerStore = defineStore('play-player', () => {
  const _videoUrl = ref('')

  const video = computed(() => _videoUrl.value)
  const videoInfo = ref<{
    raw: File | undefined
    name: string
    size: number
    md5: string | null
    type: string
    subtitles: IStream[]
    supportVideo?: string
    supportAudio?: string
  }>({
    raw: undefined,
    name: '',
    size: 0,
    md5: '',
    type: '',
    subtitles: [],
  })
  const match = ref<IMatch>()
  const comments = ref<ICommentN[] | ICommentArt[] | ICommentCCL[]>([])

  const setVideo = (file: File) => {
    URL.revokeObjectURL(_videoUrl.value)
    videoInfo.value.subtitles.forEach(item => item.revokeBlobUrl())
    videoInfo.value.supportVideo && URL.revokeObjectURL(videoInfo.value.supportVideo)
    videoInfo.value.supportAudio && URL.revokeObjectURL(videoInfo.value.supportAudio)
    _videoUrl.value = URL.createObjectURL(file)
    videoInfo.value = {
      raw: file,
      name: file.name,
      size: file.size,
      md5: null,
      type: file.type,
      subtitles: [],
    }
  }

  return { video, videoInfo, match, comments, setVideo }
})

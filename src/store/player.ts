import type { ICommentArt, ICommentCCL, ICommentN } from '~/typings/comment'
import type { IMatch } from '~/typings/match'

export type MatchStepStatus = 'pending' | 'loading' | 'success' | 'error'

export interface MatchStep {
  id: string
  label: string
  status: MatchStepStatus
  message?: string
}

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
  const comments = ref<ICommentN[] | ICommentArt[] | ICommentCCL[]>([])

  // 弹幕匹配状态
  const matchSteps = ref<MatchStep[]>([
    { id: 'md5', label: 'MD5识别', status: 'pending' },
    { id: 'file', label: '文件匹配', status: 'pending' },
    { id: 'comment', label: '获取弹幕', status: 'pending' },
  ])
  const isMatchPanelExpanded = ref(false)
  const matchFuzzyResults = ref<IMatch[]>([])
  const commentCount = ref(0)

  const setVideo = (file: File) => {
    URL.revokeObjectURL(_videoUrl.value)
    _videoUrl.value = URL.createObjectURL(file)
    videoInfo.value.raw = file
    videoInfo.value.name = file.name
    videoInfo.value.size = file.size
    videoInfo.value.md5 = null
    match.value = undefined
    comments.value = []
    // 重置匹配状态
    matchSteps.value = [
      { id: 'md5', label: 'MD5识别', status: 'pending' },
      { id: 'file', label: '文件匹配', status: 'pending' },
      { id: 'comment', label: '获取弹幕', status: 'pending' },
    ]
    isMatchPanelExpanded.value = false
    matchFuzzyResults.value = []
    commentCount.value = 0
  }

  const updateMatchStep = (stepId: string, status: MatchStepStatus, message?: string) => {
    const step = matchSteps.value.find(s => s.id === stepId)
    if (step) {
      step.status = status
      step.message = message
    }
  }

  const resetMatchSteps = () => {
    matchSteps.value = [
      { id: 'md5', label: 'MD5识别', status: 'pending' },
      { id: 'file', label: '文件匹配', status: 'pending' },
      { id: 'comment', label: '获取弹幕', status: 'pending' },
    ]
    matchFuzzyResults.value = []
  }

  return {
    video,
    videoInfo,
    match,
    comments,
    matchSteps,
    isMatchPanelExpanded,
    matchFuzzyResults,
    commentCount,
    setVideo,
    updateMatchStep,
    resetMatchSteps,
  }
})

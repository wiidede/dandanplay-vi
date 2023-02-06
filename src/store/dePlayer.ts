export const useDePlayerStore = defineStore('dePlayer-settings', () => {
  const commentShadow = ref<'border' | 'shadow' | 'none'>('border')
  const commentWeight = ref<100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>(400)
  const commentHeight = ref<25 | 50 | 75 | 100>(100)
  const commentOpacity = ref(100)
  const commentSize = ref(25)
  const commentSpeed = ref(1)
  const commentOffset = ref(0)
  const commentLimit = ref(0)

  const [showComment, toggleShowComment] = useToggle(true)

  return { commentShadow, commentWeight, commentHeight, commentOpacity, commentSize, commentSpeed, commentOffset, commentLimit, showComment, toggleShowComment }
}, {
  persist: {
    afterRestore: (ctx) => {
      ctx.store.commentOffset = 0
    },
  },
})

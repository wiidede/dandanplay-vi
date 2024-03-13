import type { MaybeRef } from 'vue'
import '@/CCL.css'
import { CommentManager } from '@/CCL'
import type { ICommentCCL } from '~/typings/comment'

export function useCCL(
  target: MaybeRef<HTMLElement | undefined>,
  comments: Ref<ICommentCCL[] | undefined>,
  playing: Ref<boolean>,
  currentTime: Ref<number>,
) {
  const store = useDePlayerStore()
  const { toggleShowComment } = store
  const { commentHeight, commentSpeed, showComment, commentOffset, commentLimit } = storeToRefs(store)

  const { width, height } = useElementSize(target)

  watch(() => unrefElement(target), (el) => {
    if (!el)
      return

    const commentManager = new CommentManager(el)
    commentManager.init()

    function startComment() {
      if (showComment.value)
        commentManager.start()
    }
    function stopComment(clear = false) {
      commentManager.stop()
      clear && commentManager.clear()
    }

    watch(comments, (val) => {
      if (val && val.length) {
        commentManager.clear()
        commentManager.load(val)
        playing.value = true
      }
    }, { immediate: true })

    watchEffect(() => {
      commentManager.setBounds(width.value, height.value * commentHeight.value / 100)
    })

    watchEffect(() => {
      commentManager.time(Math.round((currentTime.value + (commentOffset.value || 0)) * 1000))
    })

    watch(playing, (val) => {
      val ? startComment() : stopComment()
    })

    watch(commentSpeed, (val) => {
      commentManager.options.scroll.scale = 1 / val
    }, { immediate: true })

    watch(commentLimit, (val) => {
      commentManager.options.limit = val
    }, { immediate: true })

    watch(showComment, (val) => {
      val ? startComment() : stopComment(true)
    }, { immediate: true })
  })

  return {
    toggleShowComment,
    commentHeight,
    commentSpeed,
    showComment,
    commentOffset,
    commentLimit,
  }
}

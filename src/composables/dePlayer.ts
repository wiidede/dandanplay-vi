export const useDePlayerSettings = () => {
  const store = useDePlayerStore()
  const { commentOpacity } = storeToRefs(store)
  watchEffect(() => {
    if (commentOpacity.value) {
      document.body.style.setProperty('--comment-opacity', String(commentOpacity.value / 100))
    }
  })
}

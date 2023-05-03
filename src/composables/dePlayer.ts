export function useTextShadow() {
  const textShadowMap = {
    border: '#000 1px 0 1px, #000 0 1px 1px, #000 0 -1px 1px, #000 -1px 0 1px',
    shadow: 'black 0.1em 0.1em 0.2em',
    none: '0',
  } as const
  const textShadowList = Object.keys(textShadowMap) as (keyof typeof textShadowMap)[]
  const textShadowLabelMap = {
    border: '描边',
    shadow: '阴影',
    none: '无',
  } as const

  return {
    textShadowMap,
    textShadowList,
    textShadowLabelMap,
  }
}

export function useDePlayerSettings() {
  const { textShadowMap } = useTextShadow()
  const store = useDePlayerStore()
  const { commentOpacity, commentSize, commentWeight, commentShadow } = storeToRefs(store)
  watchEffect(() => {
    if (commentOpacity.value) {
      document.body.style.setProperty('--comment-opacity', String(commentOpacity.value / 100))
      document.body.style.setProperty('--comment-size', `${commentSize.value}px`)
      document.body.style.setProperty('--comment-weight', String(commentWeight.value))
      document.body.style.setProperty('--comment-shadow', textShadowMap[commentShadow.value])
    }
  })
}

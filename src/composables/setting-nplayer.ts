export const useNPlayerSettingsConst = () => {
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
  const textWeightList = ['lighter', 'normal', 'bold', 'bolder'] as const
  const textWeightLabelMap = {
    lighter: '细',
    normal: '正常',
    bold: '粗',
    bolder: '加粗',
  } as const

  return {
    textShadowMap,
    textShadowList,
    textShadowLabelMap,
    textWeightList,
    textWeightLabelMap,
  }
}

export const useNPlayerSettings = () => {
  const settingsStore = useSettingsStore()
  const { textShadow, textWeight } = storeToRefs(settingsStore)
  const {
    textShadowMap,
  } = useNPlayerSettingsConst()
  watchEffect(() => {
    if (textShadow.value) {
      document.body.style.setProperty('--comment-text-shadow', textShadowMap[textShadow.value])
    }
  })
  watchEffect(() => {
    if (textWeight.value) {
      document.body.style.setProperty('--comment-text-weight', textWeight.value)
    }
  })
}

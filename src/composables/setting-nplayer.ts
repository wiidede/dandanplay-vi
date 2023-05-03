export function useSystemSettings() {
  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)
  const colorCssVar = useCssVar('--el-color-primary', document.body)
  const colorCssVarDark = useCssVar('--el-color-primary-dark2', document.body)
  const colorEffects = [3, 5, 7, 8, 9].map((level) => {
    const colorCssVar = useCssVar(`--el-color-primary-light-${level}`, document.body)
    return (val: string) => {
      colorCssVar.value = tinycolor(val).lighten(level * 1).setAlpha(1 - level / 10).toString('rgb')
    }
  })
  const setColor = (val: string) => {
    val = `${val}FF`
    colorCssVar.value = tinycolor(val).toString('rgb')
    colorCssVarDark.value = tinycolor(val).darken(20).toString('rgb')
    colorEffects.forEach(effect => effect(val))
  }
  watch(color, val => setColor(val), { immediate: true })
}

export function useNPlayerSettingsConst() {
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
  const textWeightList = new Array(9).fill(0).map((_, index) => {
    return `${index * 100 + 100}`
  })

  return {
    textShadowMap,
    textShadowList,
    textShadowLabelMap,
    textWeightList,
  }
}

export function useNPlayerSettings() {
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

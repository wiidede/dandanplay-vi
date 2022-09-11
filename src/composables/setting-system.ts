export const useSystemSettings = () => {
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

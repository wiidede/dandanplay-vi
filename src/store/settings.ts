export const useSettingsStore = defineStore('play-settings', () => {
  const color = ref('#FF99C8')
  const textShadow = ref<'border' | 'shadow' | 'none'>('border')
  const textWeight = ref<'normal' | 'bold' | 'lighter' | 'bolder'>('normal')

  return { color, textShadow, textWeight }
}, {
  persist: true,
})

export const useSettingsStore = defineStore('play-settings', () => {
  const textShadow = ref<'border' | 'shadow' | 'none'>('border')

  const nextTextShadow = () => {
    if (textShadow.value === 'border') {
      textShadow.value = 'shadow'
    }
    else if (textShadow.value === 'shadow') {
      textShadow.value = 'none'
    }
    else {
      textShadow.value = 'border'
    }
  }

  return { textShadow, nextTextShadow }
}, {
  persist: true,
})

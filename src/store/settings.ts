import type { IMenuItem } from '~/typings/settings'

export const useSettingsStore = defineStore('play-settings', () => {
  const player = ref<'/nplayer' | '/artplayer'>('/nplayer')
  const menuList = ref<IMenuItem[]>([])
  const color = ref('#FF99C8')
  const textShadow = ref<'border' | 'shadow' | 'none'>('border')
  const textWeight = ref<'normal' | 'bold' | 'lighter' | 'bolder'>('normal')

  return { player, menuList, color, textShadow, textWeight }
}, {
  persist: true,
})

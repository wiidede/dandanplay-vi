import type { IMenuItem } from '~/typings/settings'

export const useSettingsStore = defineStore('play-settings', () => {
  const player = ref<'/nplayer' | '/artplayer'>('/nplayer')
  const menuList = ref<IMenuItem[]>([])
  const color = ref('#FF99C8')
  const textShadow = ref<'border' | 'shadow' | 'none'>('border')
  const textWeight = ref<'100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'>('400')

  return { player, menuList, color, textShadow, textWeight }
}, {
  persist: true,
})

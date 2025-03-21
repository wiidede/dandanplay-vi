import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  // presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-primary-300 text-white cursor-pointer hover:bg-primary-500 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary-300 !outline-none bg-transparent'],
    ['flex-center', 'flex items-center justify-center'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        the: FileSystemIconLoader(
          './assets/icons',
        ),
      },
    }),
  ],
  rules: [
    [/^flex-(\d+)$/, ([, d]) => ({ flex: `${Number(d)}` })],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--el-color-primary)',
        300: 'var(--el-color-primary-light-3)',
        500: 'var(--el-color-primary-light-5)',
        700: 'var(--el-color-primary-light-7)',
        800: 'var(--el-color-primary-light-8)',
        900: 'var(--el-color-primary-light-9)',
      },
      dandan: '#25AAE1',
    },
  },
})

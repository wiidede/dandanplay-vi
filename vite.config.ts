/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'

// import 'comment-core-library/dist/CommentCoreLibrary'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@/': `${path.resolve(__dirname, 'libs')}/`,
    },
  },
  plugins: [
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
        'pinia',
        {
          tinycolor2: [['default', 'tinycolor']],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
        './src/store',
        './src/services',
        './src/utils',
      ],
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },

  server: {
    // host: '0.0.0.0',
    port: 9000,
    open: true,
    proxy: { // 反向代理
      '/proxy': {
        target: 'https://api.dandanplay.net/api/v2/',
        changeOrigin: true,
        rewrite: rePath => rePath.replace(/^\/proxy/, ''),
      },
    },
  },

  worker: {
    format: 'es',
  },
})

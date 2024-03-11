// @unocss-include

import { createFetch, hasOwn } from '@vueuse/core'

export const useDanDanFetch = createFetch({
  baseUrl: 'https://api.dandanplay.net/api/v2',
  options: {
    // async beforeFetch({ options }) {
    //   const myToken = await getMyToken()
    //   options.headers.Authorization = `Bearer ${myToken}`

    //   return { options }
    // },
    afterFetch(ctx) {
      if (hasOwn(ctx.data, 'success') && !ctx.data.success)
        elNotify.error(ctx.data.errorMessage)
      return ctx
    },
    onFetchError(ctx) {
      elNotify.error(ctx.error.message)
      ElMessageBox.alert(h('div', [
        h('p', `检测到无法访问弹弹play服务器，这有两种可能：`),
        h('ol', {
          class: 'list-decimal list-inside',
        }, [
          h('li', '与服务器网络断开'),
          h('li', '服务器不允许跨域请求（控制台network或者console面板出现CORS error），这个错误web端是很难解决的，需要服务器响应头允许跨域请求。如果有兴趣可以自行去了解一些浏览器不安全的做法'),
        ]),
      ]), '请求失败')
      return ctx
    },
  },
})

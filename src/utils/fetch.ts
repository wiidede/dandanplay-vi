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
      return ctx
    },
  },
})

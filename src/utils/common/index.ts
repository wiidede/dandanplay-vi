import SparkMD5 from 'spark-md5'
import type { ICommentArt, ICommentCCL, ICommentN, ICommentRaw } from '~/typings/comment'

const dan2nTypeMap = {
  1: 'scroll',
  4: 'bottom',
  5: 'top',
} as const

export function dandan2nPlayer(danComment: ICommentRaw) {
  const [time, type, color] = danComment.p.split(',').map(i => Number(i))
  const nComment: ICommentN = {
    color: color.toString(16),
    text: danComment.m,
    time,
    type: dan2nTypeMap[type as 1 | 4 | 5],
  }
  return nComment
}

const dan2artTypeMap = {
  1: 0,
  4: 1,
  5: 1,
} as const
export function dandan2artPlayer(danComment: ICommentRaw) {
  const [time, type, color] = danComment.p.split(',').map(i => Number(i))
  const artComment: ICommentArt = {
    color: color.toString(16),
    text: danComment.m,
    time,
    mode: dan2artTypeMap[type as 1 | 4 | 5],
  }
  return artComment
}

export function dandan2CCL(danComment: ICommentRaw) {
  const [stime, type, color] = danComment.p.split(',').map(i => Number(i))
  const CCLComment: ICommentCCL = {
    color,
    text: danComment.m,
    stime: stime * 1000,
    mode: type as 1 | 4 | 5,
    size: 25,
  }
  return CCLComment
}

export function calcDandanMd5(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()

    fileReader.onload = (e) => {
      const md5 = spark.append(e.target?.result as ArrayBuffer).end()
      resolve(md5)
    }

    fileReader.onerror = (e) => {
      reject(e)
    }

    function load() {
      const start = 0
      const chunkSize = 16 * 1024 * 1024
      const end = chunkSize >= file.size ? file.size : chunkSize
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    load()
  })
}

export function useAsyncMemoizeStorage<Result extends Promise<unknown>, Args extends unknown[]>(resolver: (...args: Args) => Result, key: string, storage: Storage = localStorage) {
  const cache = ref(new Map<string, Awaited<Result> | number>())
  const cacheStorage = useStorage(key, cache, storage)

  return async (...args: Args) => {
    const argKey = JSON.stringify(args)
    const lastModified = cacheStorage.value.get('last-modified') as number || 0
    if (cacheStorage.value.has(argKey) && Date.now() - lastModified < 3 * 60 * 60 * 1000) { return cacheStorage.value.get(argKey) as Awaited<Result> }
    const result = await resolver(...args)
    cacheStorage.value.set(argKey, result)
    cacheStorage.value.set('last-modified', Date.now())
    return result
  }
}
// {
//   get: cacheStorage.value.get,
//   set: cacheStorage.value.set,
//   has: cacheStorage.value.has,
//   delete: cacheStorage.value.delete,
//   clear: cacheStorage.value.clear,
// }

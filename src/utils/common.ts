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
    color: color.toString(16).padStart(6, '0'),
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
    color: color.toString(16).padStart(6, '0'),
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

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import type { GetCommentApiReturnType } from '~/typings/comment'
import type { IStream } from '~/typings/common'

const getMatchInfoMemo = useAsyncMemoizeStorage(getMatchInfoApi, 'DanDan_MatchInfo')
const getCommentMemo = useAsyncMemoizeStorage(getCommentApi, 'Comment')

export const usePlayer = (handleCommentResult: ((res: GetCommentApiReturnType) => void) | false) => {
  const playerStore = usePlayerStore()
  const { videoInfo, match } = storeToRefs(playerStore)
  const md5 = computed(() => videoInfo.value.md5)

  const getMatchInfo = async (fileHash: string) => {
    const res = await getMatchInfoMemo({
      fileName: videoInfo.value.name,
      fileHash,
      fileSize: videoInfo.value.size,
    })
    if (res.isMatched) {
      match.value = res.matches[0]
    }
  }

  const userInputRes = (url: string) => {
    ElMessageBox.prompt(`<span>请手动将<a target="_blank" href="${url}">请求</a>结果复制到此</span>`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '请求',
      dangerouslyUseHTMLString: true,
      customClass: 'input-popper',
      inputType: 'textarea',
      showClose: false,
    }).then(({ value }) => {
      try {
        const res = JSON.parse(value)
        handleCommentResult && handleCommentResult(res)
      }
      catch (error) {
        userInputRes(url)
        elNotify.error('解析失败')
      }
    }).catch(() => {
      window.open(url, '_blank')
      userInputRes(url)
    })
  }
  const getComment = async (episodeId: number) => {
    const res = await getCommentMemo(episodeId, { withRelated: true }).catch(() => {
      elNotify.error('弹幕匹配失败')
      userInputRes(getCommentUrl(episodeId, { withRelated: 'true' }))
    })
    if (res) {
      handleCommentResult && handleCommentResult(res)
    }
  }

  watch(md5, (val) => {
    if (val) {
      elNotify.info(`Hash计算完成：${val}`)
      getMatchInfo(val)
    }
  }, { immediate: true })
  watch(match, (val) => {
    if (val) {
      elNotify.info(`视频匹配成功：${val.animeTitle} - ${val.episodeTitle}`)
      if (handleCommentResult) {
        getComment(val.episodeId)
      }
    }
  })
}

export const useCC = () => {
  const playerStore = usePlayerStore()
  const { video, videoInfo } = storeToRefs(playerStore)
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: '/node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
  })
  const audios: Pick<IStream, 'id' | 'name' | 'info'>[] = []
  const subtitles: Pick<IStream, 'id' | 'name' | 'info'>[] = []
  const streamReg = /Stream #(\d+:\d+)(?:\((\w+)\))?: (Audio|Video|Subtitle): (.+)/g
  const titleReg = /\s+title\s*: (.*)/g
  // get audio and subtitle info
  ffmpeg.setLogger(({ message }) => {
    const match = streamReg.exec(message)
    if (match) {
      const [, id, name, type, info] = match
      if (type === 'Audio') {
        audios.push({ id, name, info })
      }
      else if (type === 'Subtitle') {
        subtitles.push({ id, name, info })
      }
    }
    const titleMatch = titleReg.exec(message)
    if (titleMatch) {
      const [, title] = titleMatch
      subtitles.length && (subtitles[subtitles.length - 1].name += ` (${title})`)
    }
  })
  // write subtitle info
  const oldFileNames: string[] = []
  watch(video, async (val) => {
    oldFileNames.forEach(name => ffmpeg.FS('unlink', name))
    oldFileNames.length = 0
    const videoType = videoInfo.value.type
    const videoName = videoInfo.value.name
    // mkv
    if (val && (videoType === 'video/x-matroska' || !canPlayVideo(videoType))) {
      await ffmpeg.load()
      ffmpeg.FS('writeFile', videoName, await fetchFile(videoInfo.value.raw!))
      oldFileNames.push(videoName)
      await ffmpeg.run('-i', videoName, '-hide_banner')
      // video
      // if (!canPlayVideo(videoType)) {
      //   const newVideoName = videoName.replace(/\.\w+$/, '.mp4')
      //   await ffmpeg.run('-i', videoName, '-acodec', 'copy', newVideoName)
      //   oldFileNames.push(newVideoName)
      //   const data = ffmpeg.FS('readFile', newVideoName)
      //   const blob = new Blob([data.buffer])
      //   videoInfo.value.supportVideo = URL.createObjectURL(blob)
      // }
      // audio
      if (audios.length && !canPlayAudio(`audio/${audios[0].info.match(/(\w+)/)![1]}`)) {
        const newAudioName = videoName.replace(/\.\w+$/, '.mp3')
        await ffmpeg.run('-i', videoName, '-vn', newAudioName)
        oldFileNames.push(newAudioName)
        const data = ffmpeg.FS('readFile', newAudioName)
        const blob = new File([data.buffer], newAudioName)
        videoInfo.value.supportAudio = URL.createObjectURL(blob)
      }
      // subtitle
      if (subtitles.length) {
        videoInfo.value.subtitles = []
        for (const { id, name, info } of subtitles) {
          const fileName = `${videoName}.${name}.vtt`
          let blobUrl = ''
          const getBlobUrl = async () => {
            if (blobUrl) {
              return blobUrl
            }
            await ffmpeg.run('-i', videoName, '-map', id, fileName)
            const data = ffmpeg.FS('readFile', fileName)
            const blob = new Blob([data.buffer]) // , { type: 'text/plain' })
            blobUrl = URL.createObjectURL(blob)
            return blobUrl
          }
          const revokeBlobUrl = () => {
            blobUrl && URL.revokeObjectURL(blobUrl)
            ffmpeg.FS('unlink', fileName)
          }
          videoInfo.value.subtitles.push({ id, name, info, getBlobUrl, revokeBlobUrl })
        }
      }
    }
  }, {
    immediate: true,
  })
}

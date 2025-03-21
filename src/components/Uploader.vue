<script setup lang="ts">
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const { setVideo } = usePlayerStore()

const uploadRef = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  uploadRef.value!.handleStart(file)
}

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  const video = uploadFile.raw
  if (video)
    setVideo(video)
}
</script>

<template>
  <ElUpload
    ref="uploadRef"
    drag
    action="#"
    accept="video/*,.mkv,video/x-matroska"
    :show-file-list="false"
    :limit="1"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :on-change="handleChange"
  >
    <el-icon class="el-icon--upload">
      <UploadFilled />
    </el-icon>
    <div class="el-upload__text">
      移动视频至此或<em>点击上传</em>即可开始匹配视频信息
    </div>
    <template #tip>
      <ol>
        <li class="el-upload__tip">
          本网站只是通过
          <el-link type="primary" href="https://api.dandanplay.net/swagger" target="_blank" class="!v-unset">
            弹弹play开放平台
          </el-link>
          ，完成弹幕播放器的最小实现，完整功能请访问
          <el-link type="primary" href="https://www.dandanplay.com/" target="_blank" class="!v-unset">
            弹弹play官网
          </el-link>
          下载软件。
        </li>
        <li class="el-upload__tip">
          上传本地视频后，即可开始播放、添加弹幕等
        </li>
        <li class="el-upload__tip">
          本网站已于2025年3月21日更新至
          <el-link href="https://github.com/wiidede/dan-player" target="_blank" class="!v-unset">
            @wiidede/dan-player
          </el-link>
          这个播放器是我个人创建的，支持解析mkv字幕，使用CCL作为弹幕播放，如有任何问题，请提交
          <el-link href="https://github.com/wiidede/dan-player/issues" target="_blank" class="!v-unset">
            issues
          </el-link>
          或者切换播放器，或者访问
          <el-link href="https://8c0a2c16.dandanplay.pages.dev" target="_blank" class="!v-unset">
            历史版本
          </el-link>
        </li>
        <li class="el-upload__tip">
          本网站已经开源，并且是MIT协议，你可以随意查看、修改源码。
        </li>
        <li class="el-upload__tip">
          本网站所有接口仅供学习交流使用，不得用于商业用途。
        </li>
        <li class="el-upload__tip">
          目前只能上传一个视频，后续再次上传会覆盖之前的视频。
        </li>
        <li class="el-upload__tip">
          请尽量使用最新版的现代浏览器，以获得最佳的体验。
        </li>
        <li class="el-upload__tip">
          由于浏览器video标签限制，部分格式可能无法播放（或者无法解析音轨），可以优先使用最新版的chrome
        </li>
      </ol>
    </template>
  </ElUpload>
</template>

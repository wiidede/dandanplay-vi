<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const { setVideo } = usePlayerStore()

const uploadRef = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  uploadRef.value!.handleStart(file)
}

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  const video = uploadFile.raw
  if (video) {
    setVideo(video)
  }
}
</script>

<template>
  <ElUpload
    ref="uploadRef"
    drag
    action="#"
    accept="video/*"
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
      移动视频至此或<em>点击上传</em>
    </div>
    <template #tip>
      <ol>
        <li class="el-upload__tip">
          本网站已经开源，并且是MIT协议，你可以随意查看、修改源码。
        </li>
        <li class="el-upload__tip">
          本网站所有接口均来自互联网，仅供学习交流使用，不得用于商业用途。
        </li>
        <li class="el-upload__tip">
          本网站不会记录任何用户数据，包括但不限于用户上传的视频、用户的浏览记录、用户的 IP 地址等。
        </li>
        <li class="el-upload__tip">
          本网站只是通过弹弹play的开放平台，完成弹幕播放器的最小实现，完整功能请访问官网下载软件。
        </li>
        <li class="el-upload__tip">
          目前只能上传一个视频，后续再次上传会覆盖之前的视频。
        </li>
        <li class="el-upload__tip">
          请尽量使用最新版的现代浏览器，以获得最佳的体验。
        </li>
      </ol>
    </template>
  </ElUpload>
</template>

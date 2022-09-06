<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const { setVideo } = usePlayerStore()

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  const video = uploadFile.raw
  if (video)
    setVideo(video)
}
</script>

<template>
  <ElUpload
    drag
    action="#"
    accept="video/*"
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
      <div class="el-upload__tip">
        请尽量使用最新版的现代浏览器上传视频
      </div>
    </template>
  </ElUpload>
</template>

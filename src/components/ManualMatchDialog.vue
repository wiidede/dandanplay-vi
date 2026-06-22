<script setup lang="ts">
import type { UploadProps, UploadRawFile } from 'element-plus'
import type { CommentResult } from '~/typings/comment'

const emit = defineEmits<{
  matched: [res: CommentResult]
}>()

const visible = defineModel<boolean>('visible', { default: false })

const xml = ref('')
const clipboardError = ref('')

watch(visible, (val) => {
  if (val) {
    xml.value = ''
    clipboardError.value = ''
  }
})

function matchXml(value: string) {
  const res = parseBiliXml(value)
  if (!res) {
    elNotify.error('解析XML出错，检查是否是XML格式的字符串')
    return
  }
  emit('matched', res)
  visible.value = false
}

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  const file = uploadFile.raw as UploadRawFile | undefined
  if (!file)
    return
  const reader = new FileReader()
  reader.onload = (e) => {
    matchXml((e.target?.result as string) ?? '')
  }
  reader.onerror = () => {
    elNotify.error('读取文件失败')
  }
  reader.readAsText(file)
}

async function readClipboard() {
  clipboardError.value = ''
  try {
    const text = await navigator.clipboard.readText()
    if (!text.trim()) {
      clipboardError.value = '剪贴板为空'
      return
    }
    matchXml(text)
  }
  catch {
    clipboardError.value = '读取剪贴板失败，请改用下方文本框手动粘贴'
  }
}

function handleConfirm() {
  if (!xml.value.trim()) {
    elNotify.warning('请输入弹幕内容')
    return
  }
  matchXml(xml.value)
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="手动导入弹幕"
    width="min(90vw, 560px)"
    align-center
    :z-index="9010"
  >
    <div class="flex flex-col gap-3">
      <el-upload
        drag
        action="#"
        accept=".xml,application/xml,text/xml"
        :show-file-list="false"
        :limit="1"
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <div class="el-upload__text">
          拖拽 XML 文件至此或<em>点击上传</em>，将直接解析
        </div>
      </el-upload>

      <el-divider class="!my-1">
        或粘贴文本
      </el-divider>

      <el-button type="primary" size="large" class="w-full" @click="readClipboard">
        <div class="i-carbon-paste mr-2" />
        从剪贴板导入
      </el-button>
      <div v-if="clipboardError" class="text-sm text-[var(--el-color-danger)]">
        {{ clipboardError }}
      </div>

      <el-input
        v-model="xml"
        type="textarea"
        :rows="2"
        resize="vertical"
        placeholder="少量弹幕可直接粘贴于此；大文件建议用上方剪贴板或文件导入"
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

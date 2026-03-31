<script setup lang="ts">
import type { CommentResult } from '~/typings/comment'
import type { IMatch } from '~/typings/match'
import { ArrowDown, ArrowUp, CircleCheck, CircleClose, Loading, Minus, Warning } from '@element-plus/icons-vue'

const emit = defineEmits<{
  manualMatchXml: [res: CommentResult]
}>()

const router = useRouter()

const playerStore = usePlayerStore()
const { video, videoInfo, match, matchSteps, isMatchPanelExpanded, matchFuzzyResults, commentCount } = storeToRefs(playerStore)

const title = useTitle('弹弹play web版')

onActivated(() => {
  watchEffect(() => {
    title.value = match.value ? `${match.value.episodeTitle} - ${match.value?.animeTitle} - 弹弹play web版` : '弹弹play web版'
  })
})

onDeactivated(() => {
  title.value = '弹弹play web版'
})

const statusText = computed(() => {
  const md5Step = matchSteps.value.find(s => s.id === 'md5')
  const fileStep = matchSteps.value.find(s => s.id === 'file')
  const commentStep = matchSteps.value.find(s => s.id === 'comment')

  if (md5Step?.status === 'loading')
    return '获取文件MD5中...'
  if (fileStep?.status === 'loading')
    return '文件匹配中...'
  if (commentStep?.status === 'loading')
    return '获取弹幕中...'
  if (commentStep?.status === 'success')
    return `共装填${commentCount.value}条弹幕`
  if (fileStep?.status === 'error' || commentStep?.status === 'error')
    return '匹配失败，点击查看详情'
  return ''
})

const hasError = computed(() => {
  return matchSteps.value.some(s => s.status === 'error')
})

const showSuccessIcon = computed(() => {
  const fileStep = matchSteps.value.find(s => s.id === 'file')
  const commentStep = matchSteps.value.find(s => s.id === 'comment')
  return fileStep?.status === 'success' && commentStep?.status !== 'success'
})

function togglePanel() {
  if (hasError.value || matchSteps.value.some(s => s.status === 'success')) {
    isMatchPanelExpanded.value = !isMatchPanelExpanded.value
  }
}

async function retryStep(stepId: string) {
  const { videoInfo, updateMatchStep } = playerStore

  if (stepId === 'md5') {
    updateMatchStep('md5', 'loading')
    const worker = new Worker(new URL('~/workers/dandanMd5.ts', import.meta.url), { type: 'module' })
    worker.postMessage(videoInfo.raw)
    worker.onmessage = (e) => {
      videoInfo.md5 = e.data
      worker.terminate()
    }
  }
  else if (stepId === 'file') {
    if (videoInfo.md5) {
      updateMatchStep('file', 'loading')
      const currentMd5 = videoInfo.md5
      videoInfo.md5 = ''
      await nextTick()
      videoInfo.md5 = currentMd5
    }
  }
  else if (stepId === 'comment') {
    if (match.value) {
      updateMatchStep('comment', 'loading')
      const currentMatch = match.value
      match.value = undefined
      await nextTick()
      match.value = currentMatch
    }
  }
}

function selectFuzzyMatch(selectedMatch: IMatch) {
  match.value = selectedMatch
  playerStore.updateMatchStep('file', 'success', `${selectedMatch.animeTitle} - ${selectedMatch.episodeTitle}`)
  isMatchPanelExpanded.value = false
}

const tempFileName = ref(videoInfo.value.name)

watch(() => videoInfo.value.name, (newName) => {
  tempFileName.value = newName
})

async function retryWithNewFileName() {
  if (tempFileName.value && tempFileName.value !== videoInfo.value.name) {
    videoInfo.value.name = tempFileName.value
  }
  retryStep('file')
}

async function handleManualMatchXml() {
  const inputValue = await ElMessageBox.prompt('请输入b站XML格式的字符串', '手动匹配', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  const { value } = inputValue
  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'application/xml')
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    ElNotification({
      title: '',
      message: '解析XML出错，检查是否是XML格式的字符串',
      type: 'error',
    })
    return
  }
  const nodeList = Array.from(doc.documentElement.childNodes).filter(node => node.nodeName === 'd')
  const res: CommentResult = {
    count: nodeList.length,
    comments: nodeList.map((node, index) => ({
      cid: index,
      p: ((node as Element).attributes.getNamedItem('p')?.value ?? '').replace(/^([\d.]+),(\d+),\d+,(\d+),.*$/, '$1,$2,$3,0'),
      m: node.textContent?.trim() || '',
    })),
  }
  playerStore.commentCount = res.count
  playerStore.updateMatchStep('comment', 'success', `导入${res.count}条弹幕`)
  isMatchPanelExpanded.value = false
  emit('manualMatchXml', res)
}
</script>

<template>
  <div class="container mx-auto mb-4 flex flex-col items-center gap-4">
    <el-alert
      v-if="!video"
      title="前往首页上传本地视频"
      type="info"
      show-icon
      :closable="false"
      class="cursor-pointer"
      @click="router.push('/')"
    />
    <div class="w-full flex items-center justify-between">
      <template v-if="match">
        <h1 class="self-start">
          {{ match.animeTitle }} - {{ match.episodeTitle }}
        </h1>
      </template>
      <template v-else-if="videoInfo.name">
        <h1 class="self-start">
          {{ videoInfo.name }}
        </h1>
      </template>
      <div v-else />

      <div
        v-if="statusText && video"
        class="match-status-wrapper"
        :class="{ 'has-error': hasError, 'expanded': isMatchPanelExpanded }"
      >
        <div
          class="match-status-header"
          :class="{ clickable: hasError || matchSteps.some(s => s.status === 'success') }"
          @click="togglePanel"
        >
          <el-icon v-if="matchSteps.some(s => s.status === 'loading')" class="is-loading">
            <Loading />
          </el-icon>
          <el-icon v-else-if="hasError" class="error-icon">
            <Warning />
          </el-icon>
          <el-icon v-else-if="showSuccessIcon" class="success-icon">
            <CircleCheck />
          </el-icon>
          <span class="status-text">{{ statusText }}</span>
          <el-icon v-if="hasError || matchSteps.some(s => s.status === 'success')" class="arrow-icon">
            <ArrowDown v-if="!isMatchPanelExpanded" />
            <ArrowUp v-else />
          </el-icon>
        </div>

        <transition name="match-panel">
          <div v-show="isMatchPanelExpanded" class="match-status-panel">
            <div class="match-steps">
              <div class="match-step" :class="matchSteps.find(s => s.id === 'md5')?.status">
                <div class="step-icon">
                  <el-icon v-if="matchSteps.find(s => s.id === 'md5')?.status === 'loading'" class="is-loading">
                    <Loading />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'md5')?.status === 'success'" class="success">
                    <CircleCheck />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'md5')?.status === 'error'" class="error">
                    <CircleClose />
                  </el-icon>
                  <el-icon v-else>
                    <Minus />
                  </el-icon>
                </div>
                <div class="step-content">
                  <span class="step-label">MD5识别</span>
                  <span v-if="matchSteps.find(s => s.id === 'md5')?.message" class="step-message">
                    {{ matchSteps.find(s => s.id === 'md5')?.message }}
                  </span>
                </div>
                <el-button
                  v-if="matchSteps.find(s => s.id === 'md5')?.status === 'error'"
                  size="small"
                  @click="retryStep('md5')"
                >
                  重试
                </el-button>
              </div>

              <div class="match-step" :class="matchSteps.find(s => s.id === 'file')?.status">
                <div class="step-icon">
                  <el-icon v-if="matchSteps.find(s => s.id === 'file')?.status === 'loading'" class="is-loading">
                    <Loading />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'file')?.status === 'success'" class="success">
                    <CircleCheck />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'file')?.status === 'error'" class="error">
                    <CircleClose />
                  </el-icon>
                  <el-icon v-else>
                    <Minus />
                  </el-icon>
                </div>
                <div class="step-content">
                  <span class="step-label">文件匹配</span>
                  <span v-if="matchSteps.find(s => s.id === 'file')?.message" class="step-message">
                    {{ matchSteps.find(s => s.id === 'file')?.message }}
                  </span>
                </div>
              </div>

              <div v-if="matchSteps.find(s => s.id === 'file')?.status === 'error'" class="file-name-input-row">
                <el-input
                  v-model="tempFileName"
                  size="small"
                  class="file-name-input"
                  @keyup.enter="retryWithNewFileName"
                />
                <el-button size="small" type="primary" @click="retryWithNewFileName">
                  重试
                </el-button>
              </div>

              <div v-if="matchFuzzyResults.length > 0 && matchSteps.find(s => s.id === 'file')?.status === 'error'" class="fuzzy-results">
                <div class="fuzzy-title">
                  请选择匹配结果：
                </div>
                <div
                  v-for="item in matchFuzzyResults"
                  :key="item.episodeId"
                  class="fuzzy-item"
                  @click="selectFuzzyMatch(item)"
                >
                  <el-image v-if="item.imageUrl" :src="item.imageUrl" class="fuzzy-image" fit="cover" />
                  <div class="fuzzy-info">
                    <div class="fuzzy-anime-title">
                      {{ item.animeTitle }}
                    </div>
                    <div class="fuzzy-episode-title">
                      {{ item.episodeTitle }}
                    </div>
                    <div v-if="item.typeDescription" class="fuzzy-type">
                      {{ item.typeDescription }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="match-step" :class="matchSteps.find(s => s.id === 'comment')?.status">
                <div class="step-icon">
                  <el-icon v-if="matchSteps.find(s => s.id === 'comment')?.status === 'loading'" class="is-loading">
                    <Loading />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'comment')?.status === 'success'" class="success">
                    <CircleCheck />
                  </el-icon>
                  <el-icon v-else-if="matchSteps.find(s => s.id === 'comment')?.status === 'error'" class="error">
                    <CircleClose />
                  </el-icon>
                  <el-icon v-else>
                    <Minus />
                  </el-icon>
                </div>
                <div class="step-content">
                  <span class="step-label">获取弹幕</span>
                  <span v-if="matchSteps.find(s => s.id === 'comment')?.message" class="step-message">
                    {{ matchSteps.find(s => s.id === 'comment')?.message }}
                  </span>
                </div>
                <el-button
                  v-if="matchSteps.find(s => s.id === 'comment')?.status === 'error'"
                  size="small"
                  @click="retryStep('comment')"
                >
                  重试
                </el-button>
              </div>

              <div class="manual-match-section">
                <el-divider>或</el-divider>
                <el-button size="small" @click="handleManualMatchXml">
                  手动导入XML弹幕
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div :class="{ disabled: !video }" class="w-full">
      <slot />
    </div>
    <slot name="action" />
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
  font-weight: 500;
}

.disabled {
  pointer-events: none;
}

.match-status-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: visible;
  max-width: 400px;
}

.match-status-wrapper.expanded {
  box-shadow: var(--el-box-shadow-light);
}

.match-status-wrapper.has-error {
  border-color: var(--el-color-danger);
}

.match-status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  border-radius: 8px;
}

.match-status-header.clickable {
  cursor: pointer;
}

.match-status-header.clickable:hover {
  background: var(--el-fill-color-light);
}

.status-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-icon {
  color: var(--el-color-danger);
}

.success-icon {
  color: var(--el-color-success);
}

.arrow-icon {
  color: var(--el-text-color-secondary);
}

.match-status-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 320px;
  max-width: 400px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  z-index: 9999;
}

.match-steps {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.match-step.success {
  opacity: 0.8;
}

.step-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon .success {
  color: var(--el-color-success);
}

.step-icon .error {
  color: var(--el-color-danger);
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.step-label {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.step-message {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.file-name-input-row {
  margin-left: 36px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-name-input {
  flex: 1;
}

.fuzzy-results {
  margin-left: 36px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.fuzzy-title {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.fuzzy-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: var(--el-bg-color-overlay);
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.fuzzy-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
}

.fuzzy-item:last-child {
  margin-bottom: 0;
}

.fuzzy-image {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: cover;
}

.fuzzy-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fuzzy-anime-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fuzzy-episode-title {
  font-size: 13px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fuzzy-type {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.manual-match-section {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.manual-match-section .el-divider {
  margin: 0;
  width: 100%;
}

.match-panel-enter-active,
.match-panel-leave-active {
  transition: all 0.3s ease;
  transform-origin: top right;
}

.match-panel-enter-from,
.match-panel-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.match-panel-enter-to,
.match-panel-leave-from {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

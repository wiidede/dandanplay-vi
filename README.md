# dandanplay web

弹弹play Web简易实现，在浏览器中看本地视频弹幕，无需安装，即开即用

本项目基于弹弹play开放平台，更多功能请访问[弹弹play官网](https://www.dandanplay.com/)。

## [Site](https://dandan.wiidede.space/)

## Feature

### 核心功能

- **本地视频播放** - 支持上传本地视频文件（支持 mkv、mp4 等常见格式），在浏览器中直接播放
- **弹幕自动匹配** - 基于弹弹play开放平台API，通过文件MD5自动匹配对应的番剧和弹幕
- **多播放器支持** - 提供三种播放器可选：
  - **dan-player**（默认）- 基于 CCL 弹幕引擎，支持解析 MKV 内嵌字幕
  - **NPlayer** - 功能丰富的 HTML5 播放器，支持弹幕设置
  - **ArtPlayer** - 现代化的播放器，支持多种插件扩展

### 弹幕功能

- **自动弹幕获取** - 匹配成功后自动从弹弹play获取对应番剧的弹幕
- **手动弹幕匹配** - 支持手动输入B站XML格式弹幕，自定义导入弹幕内容
- **模糊匹配选择** - 当自动匹配到多个结果时，可手动选择正确的番剧
- **弹幕样式自定义** - 支持调整弹幕样式、大小、时间偏移等

### 界面与交互

- **主题色切换** - 内置12种预设主题色，支持自定义颜色选择器
- **暗黑模式支持** - 自动适配系统暗黑模式偏好
- **响应式设计** - 移动端适配，支持不同屏幕尺寸
- **匹配状态可视化** - 实时显示MD5计算、文件匹配、弹幕获取的进度状态

### 技术特性

- **Web Worker MD5计算** - 使用 Worker 线程计算文件MD5，避免阻塞主线程
- **Pinia 状态管理** - 持久化存储用户设置（播放器选择、主题色、弹幕样式等）
- **Vue 3 + TypeScript** - 使用组合式API，类型安全
- **弹幕格式转换** - 自动将弹弹play弹幕格式转换为各播放器支持的格式

## 有可能会做的

关注本项目的人多了，应该会考虑做，暂时自己用着方便Mac看本地视频的弹幕

- [ ] 登录
- [ ] 发送弹幕
- [ ] 上传多个文件（不知道浏览器会不会出异常，只是为了能一次上传看几集，并做不到windows app那样，有媒体库）
- [ ] 其他接口的对接

## 支持我

1. 给项目一个免费的star
2. 请我吃点东西吧[赞赏](https://wiidede.github.io/sponsor/)

## 致谢

- [弹弹play](https://www.dandanplay.com/)
- [vitesse-lite](https://github.com/antfu/vitesse-lite)
- [NPlayer](https://github.com/oyuyue/nplayer)
- [artPlayer](https://github.com/zhw2590582/ArtPlayer)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A browser-only web client for the [dandanplay](https://www.dandanplay.com/) danmaku (弹幕) platform, built on the [vitesse-lite](https://github.com/antfu/vitesse-lite) template. Users upload a local video file; the app computes its MD5, matches it against the dandanplay open API to identify the anime/episode, fetches the corresponding danmaku comments, and plays the video with overlaid comments. No backend of its own — it talks to a CORS proxy in front of the dandanplay API.

UI text and most comments are in Chinese; keep that convention when editing.

## Commands

```bash
pnpm dev          # dev server on :3333, opens browser
pnpm build        # production build (vite)
pnpm lint         # eslint (antfu config, includes formatting)
pnpm typecheck    # vue-tsc --noEmit
pnpm test         # vitest (watch mode); append a filename to scope, e.g. pnpm test common
```

Package manager is **pnpm** (`shamefully-hoist: true`). There is no separate format step — `@antfu/eslint-config` handles formatting via ESLint, so `pnpm lint --fix` is the way to format.

## Architecture

### Match → comment pipeline (the core flow)

The whole app is organized around a three-step pipeline whose state lives in `usePlayerStore` (`src/store/player.ts`) as `matchSteps` (`md5` → `file` → `comment`, each `pending|loading|success|error`):

1. **Upload** (`src/pages/index.vue`): `Uploader.vue` calls `playerStore.setVideo(file)`, which creates an object URL and resets all match state. `index.vue` then spawns a **Web Worker** (`src/workers/dandanMd5.ts`) to compute the file MD5 off the main thread, and navigates to the player route stored in settings. A 3s fallback recomputes the MD5 on the main thread if the worker hasn't responded.
2. **Match + fetch** (`src/composables/player.ts`): `usePlayer(handleCommentResult)` is the shared orchestrator used by every player page. It `watch`es `videoInfo.md5` → calls `/match`; on a single match it sets `match` and `watch`es that → calls `/comment/:episodeId`. Fuzzy (multi) matches populate `matchFuzzyResults` for manual selection in the UI. Each branch updates the corresponding `matchStep` status/message.
3. **Render**: `handleCommentResult` (passed in per page) converts raw comments to the player-specific format and feeds them to that player.

`PlayerLayout.vue` is the shared chrome around every player: it renders the match-status panel (step progress, retry buttons, fuzzy-result picker, and manual B站-XML danmaku import) and exposes a `manualMatchXml` event. Retrying a step works by re-triggering the watchers (e.g. clearing then restoring `videoInfo.md5`).

### Three interchangeable players

Each player is a route/page under `src/pages/` that wraps `PlayerLayout` and calls `usePlayer` with its own comment handler. The active player is `settingsStore.player` (a `PlayerType` = route path), persisted across sessions:

- `video.vue` (`/video`, **default**) — `@wiidede/dan-player`, auto-imported via `DanPlayerResolver`. Supports MKV subtitle parsing.
- `nplayer.vue` (`/nplayer`) — NPlayer + `@nplayer/danmaku`.
- `artplayer.vue` (`/artplayer`) — ArtPlayer.

Comment-format conversion lives in `src/utils/common.ts`: `dandan2nPlayer`, `dandan2artPlayer`, `dandan2CCL` each map a raw dandanplay comment (`p` = `"time,type,color"`, `m` = text) to that player's shape. These are the main unit-tested functions (`test/utils/common.test.ts`); update the tests when changing the mappings.

### API access

All API calls go through `useDanDanFetch` (`src/utils/fetch.ts`), a `@vueuse/core` `createFetch` instance pointed at the proxy `https://dandan-proxy.wiidede.space/api/v2`. It auto-surfaces API/network errors via `elNotify` (`src/utils/el.ts`, an Element Plus notification wrapper). Don't call the API directly — extend this instance.

### Settings, theming, persistence

`useSettingsStore` (`src/store/settings.ts`) is persisted via `pinia-plugin-persistedstate` and holds the selected player, theme `color`, and danmaku `textShadow`/`textWeight`. Composables in `src/composables/setting-nplayer.ts` apply these as live CSS variables on `document.body`:

- `useSystemSettings` drives the Element Plus primary-color CSS vars (`--el-color-primary*`) from the stored color via `tinycolor`.
- `useNPlayerSettings` sets `--comment-text-shadow` / `--comment-text-weight`.

These are invoked once in `App.vue`. UnoCSS `theme.colors.primary` (`unocss.config.ts`) aliases those same Element Plus vars, so Tailwind-style `primary-*` classes follow the live theme. Dark mode is `useDark`/`toggleDark` from `src/composables/dark.ts`.

`App.vue` wraps routes in `<keep-alive>` keyed off `settingsStore.menuList` names, so player pages stay mounted when switching.

## Conventions

- **Auto-imports** (`unplugin-auto-import` + `unplugin-vue-components`): Vue/vue-router/pinia/`@vueuse/core` APIs, everything under `src/composables|store|utils`, Element Plus components/APIs (`ElMessageBox`, `ElNotification`, etc.), and dan-player components are all auto-imported — **do not add manual imports for them**. Generated declarations live in `auto-imports.d.ts` / `components.d.ts` (committed; regenerated on dev/build).
- **Path aliases**: `~/` → `src/`, `@/` → `libs/`.
- **Routing** is file-based via `vite-plugin-pages` over `src/pages/`.
- Workers use the `?worker` import suffix and ES module format (`worker.format: 'es'` in `vite.config.ts`).
- Type definitions for API/domain shapes live in `src/typings/` (`comment.ts`, `match.ts`, `common.ts`, `settings.ts`).

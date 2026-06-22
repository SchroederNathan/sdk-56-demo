# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Expo SDK 56.** APIs have changed across recent SDKs. Read the versioned docs at
> https://docs.expo.dev/versions/v56.0.0/ before writing native or Expo code — do not
> rely on memory of older SDK signatures.

## Commands

This project uses **bun** (`packageManager: bun@1.2.22`), not npm.

```bash
bun install
bun start            # expo start (dev server / Metro)
bun run ios          # expo run:ios — native build required (uses @expo/ui, dev-client)
bun run android      # expo run:android
bun run web          # expo start --web
bun run lint         # expo lint (eslint-config-expo, flat config)
```

There is **no test runner** configured. Expo Go will not load this app — it depends on
custom native code (`@expo/ui`, `expo-dev-client`, `expo-glass-effect`), so it must run in
a development build (`run:ios` / `run:android`) or on the web.

## Architecture

A demo of **native UI rendered from React**: real SwiftUI on iOS and Jetpack Compose on
Android, driven by `@expo/ui`, with Expo Router for navigation.

### Source layout & aliases

- All source lives under `src/`. TypeScript path aliases (`tsconfig.json`): `@/*` → `src/*`,
  `@/assets/*` → `assets/*`. Import via aliases, not relative `../..` paths.
- `src/app/` is the Expo Router root. Typed routes and the React Compiler are both enabled
  (`app.json` → `experiments`).

### The route → screen → platform-split pattern (most important)

Routes are thin; the real UI is platform-specific and lives in `src/screens/`.

1. **Route file** (`src/app/health/summary.tsx`) just re-exports the screen:
   ```ts
   export { default } from '@/screens/health-summary';
   ```
2. **Metro resolves the platform variant** of that screen by extension:
   - `health-summary.ios.tsx` — SwiftUI tree (`@expo/ui/swift-ui` + `.../modifiers`)
   - `health-summary.android.tsx` — Jetpack Compose tree (`@expo/ui/jetpack-compose`)
   - `health-summary.tsx` — fallback (web / unsupported); these render
     `<NativeOnlyNotice>` since the native UI can't display.
3. **Shared, platform-agnostic data** lives in a sibling `*.data.ts`
   (e.g. `health-summary.data.ts` exports plain chart numbers; each platform applies its
   own colors/styling).

The same split appears for `settings` and `new-event`. When editing a native screen,
remember there are usually **three files** for it — change the iOS, Android, and fallback
variants together as needed.

### Navigation

`src/app/_layout.tsx` defines a single native `Stack`. Screen options often branch on
`Platform.OS` (e.g. `new-event` uses a transparent header + SwiftUI glass header + grouped
background on iOS only; Android falls back to the default opaque app bar). The `new-event`
route is presented as an iOS `formSheet`.

### Styling conventions

- **Native screens** (`@expo/ui`) style via SwiftUI/Compose *modifiers* and `PlatformColor(...)`
  (e.g. `systemGroupedBackground`, `systemRed`) for system-matched colors. SwiftUI-only style
  helpers are centralized in `src/styles.ts` and imported only by `.ios.tsx` files.
- **Plain React Native screens** (home `index.tsx`, web) use `ThemedText`/`ThemedView`,
  the `useTheme()` hook, and tokens from `src/constants/theme.ts` (`Colors`, `Spacing`).

### Splash / icon animation

`src/components/animated-icon.tsx` drives the launch animation with Reanimated `Keyframe`s
and `react-native-worklets` (`scheduleOnRN`). `AnimatedSplashOverlay` is mounted in the root
layout and unmounts itself when its entering animation finishes. It has a `.web.tsx` variant
(CSS-driven).

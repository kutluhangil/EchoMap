# Echo Map Design & Robustness Overhaul — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.
> Companion spec: `docs/superpowers/specs/2026-06-14-echomap-design-overhaul-design.md`.

**Goal:** Make Echo Map premium on both surfaces — a content-alive cinematic web demo and a more tactile, more robust native app — without breaking the "cool world, warm memory; one quiet motif" thesis.

**Architecture:** Six phases, each its own commit(s) on `feat/design-overhaul`. Foundation first (motion/elevation tokens + shared ring primitive), then robustness (geo timeout, optional location, toasts), then content (demo seed via synth audio), then the web landing, then in-app polish, then verify + smoke.

**Tech Stack:** Expo SDK 56 · RN 0.85 · Reanimated 4 · Skia · R3F · Drizzle/SQLite · Zustand · i18next.

**Branch:** `feat/design-overhaul` (already created; perf + README + spec already committed).

---

## File map

| Path                                  | Action   | Responsibility                           |
| ------------------------------------- | -------- | ---------------------------------------- |
| `theme/motion.ts`                     | create   | Canonical durations + easings/springs    |
| `theme/elevation.ts`                  | create   | Shadow + ember-glow style tokens         |
| `theme/index.ts`                      | modify   | Re-export motion + elevation             |
| `components/motion/PulseRing.tsx`     | create   | Quiet idle ring pulse (Skia)             |
| `components/audio/AmplitudeRings.tsx` | modify   | Softer falloff, motion tokens            |
| `components/map/SoundRingPin.tsx`     | modify   | Faint outer halo, motion tokens          |
| `lib/location/geo.ts`                 | modify   | 8s timeout race on geo calls             |
| `lib/db/schema.ts`                    | modify   | `lat`/`lng` nullable                     |
| `lib/db/migrations/*`                 | generate | Drizzle migration for nullable coords    |
| `lib/db/echoes.ts`                    | modify   | Located-only query for the map           |
| `store/useEchoStore.ts`               | modify   | `CreateEchoInput` accepts null coords    |
| `app/echo/new.tsx`                    | modify   | Save without location; location optional |
| `store/useToastStore.ts`              | create   | Toast queue (Zustand)                    |
| `components/ui/Toast.tsx`             | create   | Toast host + item                        |
| `lib/observability/report.ts`         | create   | Thin error reporter (Sentry-ready)       |
| `lib/audio/synth.ts`                  | create   | Generate tiny WAV (PCM sine)             |
| `lib/db/seed.ts`                      | create   | Curated demo echoes + synth audio        |
| `store/useSettingsStore.ts`           | modify   | `demoMode` flag + clear                  |
| `app/index.web.tsx`                   | create   | Web landing hero                         |
| `components/landing/*`                | create   | Landing pieces (hero, CTA, features)     |
| `app/(tabs)/map.tsx`                  | modify   | FAB pulse, intro camera, empty state     |
| `app/echo/[id].tsx`                   | modify   | Ringed hero waveform, null-place copy    |
| `app/onboarding.tsx`                  | modify   | Faint ring motif behind slides           |
| `locales/en.json` · `tr.json`         | modify   | New keys (kept in sync)                  |
| `.maestro/smoke.yaml`                 | create   | Native E2E smoke                         |

---

## Phase 1 — Design-language foundation

### Task 1.1 — Motion + elevation tokens

**Files:** create `theme/motion.ts`, `theme/elevation.ts`; modify `theme/index.ts`.

- [ ] `theme/motion.ts`: export `duration = { fast: 160, base: 280, slow: 560 }`, `easing` (out/inOut quad via `Easing`), and `spring = { gentle, snappy }` configs.
- [ ] `theme/elevation.ts`: export `shadow.sm/md` (cross-platform) and `glow(color, level)` returning ember-tinted shadow style.
- [ ] Re-export both from `theme/index.ts`.
- [ ] Verify: `npm run typecheck`.
- [ ] Commit: `feat: add motion and elevation design tokens`.

### Task 1.2 — PulseRing primitive

**Files:** create `components/motion/PulseRing.tsx`.

- [ ] Skia canvas, 1–2 stroked rings expanding + fading on a `withRepeat` loop using `theme/motion` timing; `animate` prop for reduce-motion; `color`/`size` props.
- [ ] Verify: typecheck.
- [ ] Commit: `feat: add ambient PulseRing primitive`.

### Task 1.3 — Soften existing rings

**Files:** modify `components/audio/AmplitudeRings.tsx`, `components/map/SoundRingPin.tsx`.

- [ ] Add a faint outer halo circle (low opacity, larger radius) under the existing rings; pull `DURATION` from `theme/motion`.
- [ ] Verify: typecheck + lint.
- [ ] Commit: `style: soften sound-ring falloff`.

### Task 1.4 — UI surface consistency

**Files:** modify `components/ui/Button.tsx`, `Sheet.tsx`, `Field.tsx`, `EmptyState.tsx`.

- [ ] Apply elevation/glow tokens to primary Button + FAB-like surfaces; consistent border + pressed state. No API changes.
- [ ] Verify: typecheck + lint.
- [ ] Commit: `style: unify UI surface elevation and press states`.

**Phase 1 gate:** typecheck + lint clean.

---

## Phase 2 — Robustness

### Task 2.1 — Geo timeout

**Files:** modify `lib/location/geo.ts`, `lib/location/reverse-geocode.ts`.

- [ ] Add `withTimeout<T>(p, ms, fallback)` helper (Promise.race). Wrap `getCurrentCoordinates` (8s → null) and `reverseGeocode` (8s → null).
- [ ] Verify: typecheck. Manual: deny GPS → returns null within 8s, no hang.
- [ ] Commit: `fix: bound location lookups with an 8s timeout`.

### Task 2.2 — Nullable coordinates (schema + migration)

**Files:** modify `lib/db/schema.ts`; run `npm run db:generate`; modify `lib/db/echoes.ts`.

- [ ] `lat`/`lng`: drop `.notNull()`. Regenerate migration. Add `listLocatedEchoes()` (WHERE lat IS NOT NULL) for the map.
- [ ] Verify: typecheck; migration file generated; app boots + migrates.
- [ ] Commit: `feat: allow echoes without a location`.

### Task 2.3 — Store + capture flow accept null location

**Files:** modify `store/useEchoStore.ts`, `app/echo/new.tsx`; `locales/*`.

- [ ] `CreateEchoInput.lat/lng: number | null`. Save enabled when a recording exists; if no location, save with null coords + copy "Saved without a place." Keep "Add location" retry.
- [ ] Map uses `listLocatedEchoes`; timeline/detail render with no place.
- [ ] Verify: typecheck + lint. Manual: record → deny location → Save works.
- [ ] Commit: `feat: let a recording be saved without a location`.

### Task 2.4 — Toasts + reporter

**Files:** create `store/useToastStore.ts`, `components/ui/Toast.tsx`, `lib/observability/report.ts`; modify `AppProviders.tsx`, `app/echo/new.tsx`, `app/echo/[id].tsx`, sync.

- [ ] Toast store (queue, `show({type,message})`, auto-dismiss). `Toast` host mounted in providers, animated with motion tokens. `report(error, context)` logs + (if `EXPO_PUBLIC_SENTRY_DSN`) is the single Sentry seam.
- [ ] Replace silent `catch {}` (save fail, share, sync) with `report()` + toast.
- [ ] Verify: typecheck + lint. Manual: force a save error → toast appears.
- [ ] Commit: `feat: surface errors with toasts and a reporter seam`.

**Phase 2 gate:** typecheck + lint clean; app migrates and runs.

---

## Phase 3 — Demo seed

### Task 3.1 — WAV synth

**Files:** create `lib/audio/synth.ts`; test `lib/audio/__tests__/synth.test.ts` (if a runner is wired) else manual.

- [ ] `synthToneWav(freqHz, seconds): Uint8Array` — 8kHz mono PCM16 sine + 44-byte WAV header. `writeToneFile(id, freq): Promise<string>` writes into the echoes dir, returns path.
- [ ] Verify: header bytes (`RIFF`/`WAVE`), length = 44 + samples\*2. Manual: file plays in the player.
- [ ] Commit: `feat: add self-contained WAV tone synth for demo audio`.

### Task 3.2 — Seed module + demo mode

**Files:** create `lib/db/seed.ts`; modify `store/useSettingsStore.ts`, `store/useEchoStore.ts`, `DatabaseProvider.tsx`; `locales/*`.

- [ ] 6 curated demo echoes (coords/titles/notes/waveform bars). `seedDemo()` writes synth audio + waveform + rows, idempotent (skip if any echo exists). `demoMode` flag default true on web, false native. Seed after hydrate when empty + demoMode. `clearDemo()`.
- [ ] Verify: typecheck + lint. Manual web: map + timeline + globe show content; native: empty as before.
- [ ] Commit: `feat: seed a live demo dataset on the web build`.

**Phase 3 gate:** web build shows content; native unaffected.

---

## Phase 4 — Web landing hero

### Task 4.1 — Landing components

**Files:** create `components/landing/LandingHero.tsx`, `FeatureRow.tsx`.

- [ ] Full-bleed `GlobeScene` (slow auto-rotate, demo points), centered name + tagline, two CTAs (`Demo'yu dene`, `GitHub`), quiet ring footer, 3 feature one-liners. Responsive via `useWindowDimensions`. DPR-capped Canvas; pause rotation when `document.hidden`.
- [ ] Verify: typecheck + lint.
- [ ] Commit: `feat: add web landing hero components`.

### Task 4.2 — Web index route

**Files:** create `app/index.web.tsx`; modify `lib/db/seed.ts` call on CTA.

- [ ] Render `LandingHero`. "Demo'yu dene" → ensure demo seeded → `router.replace('/(tabs)/map')`. Native `app/index.tsx` untouched (Expo resolves `.web`).
- [ ] Verify: typecheck; `npm run build:web` succeeds; visit `/` shows landing.
- [ ] Commit: `feat: serve a cinematic landing on the web build`.

**Phase 4 gate:** `build:web` ok; landing renders; CTA enters alive demo.

---

## Phase 5 — In-app polish

### Task 5.1 — Map polish

**Files:** modify `app/(tabs)/map.tsx`, `components/CaptureButton.tsx`, `components/map/EchoMap.tsx`.

- [ ] FAB wrapped with `PulseRing` (reduce-motion off) + glow token. Intro: fit camera to located echoes on mount. Refined empty state + recenter button.
- [ ] Verify: typecheck + lint.
- [ ] Commit: `style: enliven the map FAB and intro camera`.

### Task 5.2 — Detail + onboarding polish

**Files:** modify `app/echo/[id].tsx`, `app/onboarding.tsx`.

- [ ] Detail: frame the hero waveform with a static ring; tighten type rhythm; null-place copy. Onboarding: faint `PulseRing` motif behind slides; refined dots.
- [ ] Verify: typecheck + lint.
- [ ] Commit: `style: polish detail and onboarding screens`.

**Phase 5 gate:** typecheck + lint clean; screens reviewed on web/native.

---

## Phase 6 — E2E smoke + verify + ship

### Task 6.1 — Maestro smoke

**Files:** create `.maestro/smoke.yaml`.

- [ ] Flow: launch → skip globe → finish onboarding → open capture → (record) → save → timeline → open detail → delete. Documented run cmd: `maestro test .maestro/smoke.yaml`.
- [ ] Commit: `test: add Maestro native smoke flow`.

### Task 6.2 — Verify + docs

**Files:** modify `docs/launch-checklist.md`, `README.md` (roadmap ticks).

- [ ] Run `npm run typecheck`, `npm run lint`, `npm run build:web`. Confirm demo alias public. Note Deployment-Protection state. Tick shipped roadmap items.
- [ ] Commit: `docs: update launch checklist and roadmap`.

**Phase 6 gate:** all green; web demo public + alive.

---

## Self-review notes

- Spec coverage: all 4 robustness items (T2.1–2.4), demo seed (T3.x), landing (T4.x), polish (T5.x), verify/smoke (T6.x), design tokens (T1.x). ✓
- Types: `CreateEchoInput.lat/lng: number | null` consistent across T2.2/2.3; `listLocatedEchoes` named identically in T2.2 and T5.1.
- Risk: SQLite nullable migration — verify on a seeded DB before relying on it (T2.2 gate).

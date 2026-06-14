# Echo Map — Design & Robustness Overhaul

**Date:** 2026-06-14
**Status:** Approved direction (Full overhaul · refined-quiet · all robustness items)
**Owner:** Kutluhan Gil

---

## 1. Goal

Lift Echo Map from "polished app" to "premium on both surfaces": a cinematic,
content-alive **web demo** for the portfolio link, and a more tactile, more
robust **native app**. Keep the design thesis intact — _a cool world, a warm
memory; one bold motif (sound rings), the rest quiet._

Two failures this fixes:

1. **Web demo is weak.** A visitor lands on the globe, hits a permission-gated
   onboarding, then an **empty** map. No story, no content, native features
   limited on web.
2. **A real bug + silent failures.** A recording can become unsaveable if the
   location permission is denied (Save stays disabled), location calls can hang
   forever, and errors are swallowed by empty `catch {}`.

## 2. Design principles (refined-quiet)

- **One motif:** sound rings. They live in the recorder, player, map pins, FAB,
  landing, and onboarding — one visual language.
- **Cool ground, warm memory:** slate stays calm and desaturated; the single
  ember accent carries everything. No second accent.
- **Measured glow, gentle motion:** soft ember bloom, short fades, light
  parallax. Reduce-motion always respected.
- **Whitespace is luxury.** Don't fill space; frame it.
- **No glassmorphism overload, no gradients-everywhere.** (Explicitly rejected.)

## 3. Phases

### Phase 1 — Design-language foundation

Shared primitives so every later screen feels consistent.

- `theme/motion.ts` (new): canonical durations (`fast 160`, `base 280`,
  `slow 560`) and easings/springs. All animations import from here.
- `theme/elevation.ts` (new): soft shadow + ember-glow tokens (`glowSm/glowMd`)
  used by FAB, selected pin, landing CTA.
- `components/motion/PulseRing.tsx` (new): a quiet idle ring pulse (Skia),
  reused by FAB and landing — the ambient, non-amplitude cousin of
  `AmplitudeRings`.
- `AmplitudeRings.tsx` / `SoundRingPin.tsx`: softer falloff (add a faint outer
  halo ring), pull timings from `theme/motion`.
- `components/ui` (Button, Sheet, Field, EmptyState): consistent border + inner
  highlight, focus/press states, radius from tokens.

### Phase 2 — Robustness (all four items)

- **Location timeout + retry** — `lib/location/geo.ts`: wrap
  `getCurrentCoordinates` and `reverseGeocode` in an 8 s timeout
  (`Promise.race`) so the UI never hangs; return `null` on timeout.
- **Location fallback (real bug fix)** — make geo optional:
  - Schema: `lat`/`lng` become **nullable** (`real('lat')` without `.notNull()`).
    New Drizzle migration (`npm run db:generate`).
  - `useEchoStore.createEcho` / `CreateEchoInput`: accept `lat: number | null`.
  - `app/echo/new.tsx`: Save enabled once a recording exists; location is a
    bonus. Copy: "Add location" vs "Saved without a place."
  - Map plots only located echoes; timeline + detail handle a missing place
    gracefully.
- **Error surfacing** — `components/ui/Toast.tsx` + a tiny `useToastStore`
  (Zustand). Replace silent `catch {}` (save, share, sync) with a toast.
  `lib/observability/report.ts`: a thin reporter that logs now and is ready for
  Sentry (wired only if `EXPO_PUBLIC_SENTRY_DSN` is set — no heavy SDK added in
  this pass to avoid node_modules churn on the external volume).
- **Demo seed** — see Phase 3 (shared module).

### Phase 3 — Demo seed (content-alive)

- `lib/audio/synth.ts` (new): generate a tiny WAV (PCM sine, ~2 s, per-echo
  frequency) so demo echoes are **self-contained** — no bundled/licensed audio.
- `lib/db/seed.ts` (new): ~6 curated demo echoes (İstanbul, İzmir, a coastline,
  a café…) with titles, notes, coords, synthetic waveform bars, and a synth
  audio file written into the sandbox.
- **Demo mode:** ON by default on web (so the demo is alive), OFF on native.
  Seeds only when the store is empty. A subtle "Demo data" chip + a "Clear demo"
  action in settings. Native users never get surprise rows.

### Phase 4 — Web landing hero

- `app/index.web.tsx` (new, platform-resolved by Expo Router; native keeps
  `app/index.tsx`): a cinematic landing.
  - Full-bleed slow-rotating `GlobeScene` lit by the demo echoes.
  - App name (Clash Display), tagline, two CTAs: **"Demo'yu dene"** (seeds demo
    if needed → `/(tabs)/map`) and **GitHub**.
  - A quiet sound-ring footer motif; three one-line feature highlights.
  - Responsive to web widths; RN primitives + Reanimated (web-safe).

### Phase 5 — In-app polish

- **Map:** FAB gets `PulseRing`; intro camera flies to fit all echoes; refined
  empty state; recenter button polish.
- **Globe → map:** continuity (gentle scale into the map), reduce-motion safe.
- **Detail:** hero waveform framed by rings, tighter type rhythm, share polish.
- **Onboarding:** a faint animated ring motif behind the slides; dot/progress
  refinement.
- **Capture/Recorder/Player:** press feedback + ring refinements from Phase 1.

### Phase 6 — E2E smoke + verify + ship

- `.maestro/smoke.yaml`: native flow — launch → skip globe → onboarding →
  record → save → timeline → detail → delete.
- Verify gate: `typecheck`, `lint`, `build:web` succeeds, app runs.
- Confirm the public demo alias (`echo-map-seven.vercel.app`, currently 200) and
  document it; note Deployment Protection state in the launch checklist.

## 4. Data model change

`echoes.lat` / `echoes.lng`: `notNull` → nullable. One additive Drizzle
migration via table-recreate (SQLite). Existing rows keep their coords; new rows
may store `null`. Indices unchanged (a partial/located filter is applied in the
map query).

## 5. Testing strategy

- Unit: `synth.ts` (valid WAV header/length), `geo` timeout (races to null),
  `format` unchanged.
- Component/logic: `createEcho` with `lat=null`; seed idempotency (no double
  seed); toast store.
- E2E: Maestro native smoke (Phase 6).
- Manual: web demo loads alive; record→save with and without location; reduce
  motion.

## 6. Risks & mitigations

- **Schema migration on a live local DB** → additive, table-recreate, tested on
  a seeded DB before shipping; keep a fallback that treats missing coords as
  unplotted.
- **R3F globe on web perf** → cap DPR, pause rotation when tab hidden, reduce
  point count on web.
- **External-volume node_modules churn** → no heavy new deps (Sentry/Maestro
  bring no runtime dep; Maestro is a CLI). Synth/toast are hand-rolled.
- **Demo data leaking to native users** → demo mode OFF on native, seeds only
  when empty, clearly labelled, one-tap clearable.

## 7. Out of scope (YAGNI)

Real Sentry SDK wiring, Playwright web E2E, multi-device sync changes, iOS
release, social/shared maps, on-device sound classification. (Hooks left where
cheap; implementation deferred.)

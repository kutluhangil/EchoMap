# Echo Map — working notes for Claude

A sound map of your life: record short ambient sounds, geotag them, and hear
them again years later on a map. Local-first, bilingual (TR/EN), built for
Google Play. The full design and build plan lives in `ECHO-MAP-blueprint.md`.

## Stack

Expo (SDK 56, managed) · TypeScript (strict) · Expo Router (routes in `app/`) ·
Reanimated · Skia · React Three Fiber (opening globe) · Mapbox · expo-audio ·
SQLite + Drizzle · Zustand · i18next.

## Layout

- `app/` — Expo Router screens. `@/*` path alias maps to the repo root.
- `components/` — UI kit, map, audio, globe, motion, providers.
- `lib/` — db, audio, location, storage, sync, i18n, utils.
- `theme/` — colors, typography, spacing, ThemeProvider.
- `store/` — Zustand stores. `locales/` — `en.json` / `tr.json` (keys must stay in sync).

## Conventions

This is a personal portfolio project; it should read as human-made.

- **Commits:** the user's identity only. **No AI attribution, no Co-Authored-By
  trailer.** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`,
  `docs:`, `style:`), short and in English. Prefer several logical commits over
  one large dump.
- **Comments:** English, explaining _why_ (the code already says what). Reserve
  them for non-obvious logic, edge cases, and architectural decisions. No
  robotic over-commenting.
- **TypeScript:** strict; avoid `any`; keep types explicit.
- **Lint/format:** ESLint (`npm run lint`) + Prettier. A Husky pre-commit hook
  runs lint-staged and `npm run typecheck`.

## Design thesis

A cool world, a warm memory. The map/globe stay cool and desaturated (slate,
fog); memories glow warm (ember). Signature element: sound rings — every sound
radiates concentric rings that pulse to real amplitude. One bold motif; keep
the rest quiet.

## Build order (agents)

Architect → Aesthetician → Data Layer → Globe Smith → Cartographer →
Sound Keeper → Memory Weaver → Motion Director → Compliance & Launch.
Each agent owns a slice; heavy native deps are installed by the agent that
uses them.

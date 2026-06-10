# Launch Checklist — Google Play

Status of Play readiness. ✅ done in the repo · ⬜ needs you (account, hosting,
console). Policies change — verify current requirements in Play Console.

## Build & config
- ✅ Managed Expo app, production EAS profile builds an **AAB** (`eas.json`)
- ✅ Bundle id / package: `com.kutluhangil.echomap`
- ✅ Permissions: `RECORD_AUDIO`, foreground `ACCESS_FINE/COARSE_LOCATION`; **no**
  background location
- ✅ In-context **prominent disclosure** before mic/location requests (onboarding)
- ⬜ **Target API level** — confirm Play's currently required level and that the
  build targets it (Expo SDK 56 targets a recent API; re-check at submit time)
- ⬜ Enable **Play App Signing** when you create the app in Play Console

## Store assets
- ✅ App icon (`assets/images/icon.png`, 1024²) + adaptive foreground/monochrome
- ✅ Feature graphic 1024×500 (`store-assets/feature-graphic.png`)
- ✅ Listing copy TR + EN (`store-assets/listing-copy.md`)
- ⬜ Phone screenshots — retake on a clean release build, ≥2 (ideally 4–8), TR+EN
  (starting set in `store-assets/screenshots/`)

## Policy
- ✅ Privacy policy written (`docs/privacy-policy.md`) — fill contact email
- ⬜ **Host** the privacy policy at a public URL (e.g. GitHub Pages) and paste the
  URL into Play Console
- ✅ Data Safety mapping (`docs/data-safety.md`) — use it to fill the form
- ⬜ Complete the **Data Safety** form in Play Console
- ⬜ Complete the **content rating** questionnaire (likely Everyone)
- ⬜ Set **target audience** to not children (avoid Families policy)
- ⬜ Account & data **deletion** path is required if you enable cloud backup
  (the app provides in-app deletion; also offer a web/email route)

## Quality
- ✅ Accessibility pass documented (`docs/accessibility.md`)
- ✅ Lazy-loaded heavy modules (globe/map), reduce-motion support
- ⬜ Verify crash-free / no ANR on a physical device before rollout

## Release track
- ⬜ New personal developer accounts: Play may require **closed testing**
  (12+ testers, 14 days) before production. Plan: internal → closed → production.
- ⬜ Build the AAB: `eas build --platform android --profile production`
- ⬜ Optionally submit via `eas submit` (configure a Play service account)

# Accessibility — Echo Map

What's implemented and how to verify before launch.

## Implemented

- **Screen reader labels** — interactive controls expose roles and labels:
  buttons (`accessibilityRole="button"`, `accessibilityState` for disabled/busy),
  the record/stop control, recenter, share, close, and the waveform (exposed as
  an adjustable seek control).
- **Touch targets ≥ 48dp** — primary button height 52, record FAB 64, recenter
  48, icon buttons 40 with hit-slop. (Audit any control added later.)
- **Contrast (WCAG AA)** — text on background and the ink-on-ember button label
  meet AA; the accent (ember) is reserved for emphasis, not body text.
- **Reduce motion** — honored via Reanimated's `useReducedMotion` across stack
  transitions, the FadeIn reveal, the SharedElement morph, the button
  press-scale, the opening globe (static orient + quick finish), and the sound
  rings (no breathing animation).
- **Dynamic type** — text uses React Native's default font scaling, so it
  responds to the device font-size setting.
- **Localized** — full TR/EN, including permission disclosures and errors.

## To verify on device

- [ ] Turn on **TalkBack** (Android) and walk the core flows (record → save →
      play → delete). Every control should announce a meaningful label.
- [ ] Enable **Remove animations** (Android) and confirm transitions fall back
      to a cross-fade and the rings/globe don't animate.
- [ ] Set **Font size** to the largest setting; confirm no clipped or
      overlapping text on the capture, detail, and timeline screens.
- [ ] Check color contrast on both light and dark themes with a contrast tool.
- [ ] Confirm the map and timeline are operable without relying on color alone.

# 🌍 Echo Map

> A sound map of your life. Record the ambient sounds of meaningful places,
> pin them to a map, and hear them again years later.

Echo Map lets you capture short ambient recordings — a café's hum, waves on a
beach, a street musician — and pin them to where they happened. Open the map
later and tap a pin to relive the moment through sound. Not photos. Sound.

## Features

- 🎙️ One-tap ambient recording with a live waveform
- 🗺️ Geotagged sound pins on a custom minimalist map
- 🌍 Animated 3D globe on launch, lit by your memories
- 📜 Chronological timeline of your echoes
- 🌓 Light & dark · 🌐 English & Türkçe
- 🔒 Local-first — your sounds stay on your device (optional cloud backup)

## Tech

React Native (Expo · SDK 56) · TypeScript · React Three Fiber · React Native
Skia · Mapbox · expo-audio · SQLite (Drizzle) · Reanimated · i18next

## Run locally

```bash
npm install
cp .env.example .env   # add your Mapbox token
npx expo start
```

The app uses native modules (Mapbox, Skia, audio), so it runs in a
[development build](https://docs.expo.dev/develop/development-builds/introduction/)
rather than Expo Go.

## Privacy

Recordings are stored locally on your device by default. Cloud backup is opt-in.

## License

MIT

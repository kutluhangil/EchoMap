<div align="center">

<img src="docs/media/hero.svg" alt="Echo Map — a sound map of your life" width="100%">

<p>
  <img alt="Expo" src="https://img.shields.io/badge/Expo-React%20Native-ff8a4c?style=for-the-badge&labelColor=06090d">
  <img alt="Mapbox" src="https://img.shields.io/badge/Mapbox-custom%20slate%20map-5ec8ff?style=for-the-badge&labelColor=06090d">
  <img alt="Skia" src="https://img.shields.io/badge/Skia-sound%20rings-ffd166?style=for-the-badge&labelColor=06090d">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-ff8a4c?style=for-the-badge&labelColor=06090d">
</p>

<p><em>Capture the short ambient sounds of the places that matter and pin them where they happened.<br>
Open the map years later, tap a glowing pin, and you are back in that moment. Not photos. Sound.</em></p>

<table>
  <tr>
    <td width="25%"><img src="store-assets/screenshots/01-map.png" alt="The sound map"></td>
    <td width="25%"><img src="store-assets/screenshots/02-recording.png" alt="Recording with sound rings"></td>
    <td width="25%"><img src="store-assets/screenshots/03-capture-details.png" alt="Capture details"></td>
    <td width="25%"><img src="store-assets/screenshots/04-timeline.png" alt="The timeline"></td>
  </tr>
</table>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## What it is

A café's murmur, waves on the shore, a street musician, your child's laugh. Echo Map is built around one motif: **sound rings**. Every recording radiates concentric ember rings that pulse to the real amplitude of the audio, so the recorder, the player and the map pins all speak the same language. A cool world, a warm memory.

| | |
|---|---|
| **One-tap recording** | Live, sound-reactive rings and a scrubbable waveform driven by real metering. |
| **Geotagged pins** | Each echo is located automatically and dropped on a custom slate Mapbox map. |
| **Opening globe** | A React Three Fiber globe on launch, lit by the places you have been. |
| **Nostalgic timeline** | Echoes in reverse order, where "three years ago" does the emotional work. |
| **Sound rings** | Skia-rendered rings shared by the recorder, the player and the pins. |
| **Light and dark** | A considered theme system, automatic or manual. |

<img src="docs/media/divider.svg" width="100%" alt="">

## How it fits together

```mermaid
flowchart LR
  MIC[expo-audio · metering] --> REC[Recorder · Skia rings]
  GPS[Location] --> REC
  REC --> DB[(Local SQLite · Drizzle)]
  DB --> MAP[Mapbox map · glowing pins]
  DB --> TL[Timeline]
  DB <--> SB[(Supabase · optional sync)]
  MAP --> PLAY[Player · same rings]
```

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**Echo Map**, hayatının bir ses haritası. Anlamlı yerlerin kısa ortam seslerini (bir kafenin uğultusu, sahildeki dalgalar, bir sokak çalgıcısı, çocuğunun kahkahası) kaydedip yaşandığı yere iğneliyorsun. Yıllar sonra haritadaki parlayan iğneye dokununca o ana fotoğrafla değil sesle dönüyorsun. Kayıt, oynatıcı ve harita iğneleri sesin gerçek şiddetine göre atan halkalarla aynı görsel dili paylaşıyor. Expo ile yazılmış bir mobil uygulama.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
npm install
cp .env.example .env         # Mapbox token, optional Supabase
npx expo start
npm run typecheck
npm run db:generate          # Drizzle migrations
```

```
app/          expo-router screens: onboarding, tabs, echo detail
components/   recorder, rings, map, timeline, globe
store-assets/ store screenshots
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>A cool world, a warm memory.</sub>
</div>

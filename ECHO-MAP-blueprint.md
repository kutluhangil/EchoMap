# 🌍 ECHO MAP

> **A sound map of your life.** Fotoğraf değil — ses üzerinden nostalji. Anlamlı yerlerin kısa ortam seslerini kaydet, geotag'le, yıllar sonra haritada bir pin'e dokun ve o anın sesini tekrar duy. Serin, sessiz bir dünya üzerinde, hafızanın sıcak bir parıltısı.

```
version:   v1.0.0-blueprint
target:    Claude Code (VS Code)
platform:  React Native (Expo) · TypeScript
backend:   local-first (SQLite + FS) + opsiyonel Supabase sync
store:     Google Play (AAB via EAS)
languages: TR + EN (bilingual, i18next)
aesthetic: premium minimalist — cool slate world · warm ember memory
build:     9 specialized agents
```

---

## 📌 TL;DR

Fotoğraf haritaları var (Google Photos, Polarsteps). Ses haritası yok. **Echo Map** bu boşluğu duygusal bir yerden dolduruyor:

- **Ses kaydet + geotag'le** — bir kafenin uğultusu, sahildeki dalga, sokak çalgıcısı, çocuğunun gülüşü
- **Animasyonlu açılış** — dönen bir dünya, hafızalarının olduğu yerlerde nabız gibi atan ışık noktaları, kullanıcının konumuna zoom → haritaya geçiş
- **Premium minimalist tasarım** — serin slate harita dünyası, hafızalar sıcak kehribar parıltısıyla işaretli; her pin bir ses kaynağı gibi halkalar yayar
- **Local-first** — sesler cihazda kalır, hesap gerektirmez, gizlilik önce; opsiyonel ücretsiz Supabase yedekleme
- **Bilingual TR/EN** — sistem diline göre otomatik
- **Google Play hazır** — gizlilik politikası, data safety, izin disclosure'ları, AAB, store asset'leri dahil planlı

Bu dosya Claude Code için yazıldı. **9 ajan halinde organize edildi.**

---

## 📋 İÇİNDEKİLER

1. [Tasarım Felsefesi & Thesis](#-tasarım-felsefesi--thesis)
2. [Görsel Sistem](#-görsel-sistem)
3. [Signature: Sound Rings](#-signature-sound-rings)
4. [Teknoloji Yığını](#-teknoloji-yığını)
5. [Backend / Veri Kararı](#-backend--veri-kararı)
6. [Bilingual (TR/EN) Sistemi](#-bilingual-tren-sistemi)
7. [Geliştirme Konvansiyonları](#-geliştirme-konvansiyonları)
8. [Klasör Yapısı](#-klasör-yapısı)
9. [Ekranlar & Akışlar](#-ekranlar--akışlar)
10. [Ajan Sistemi](#-ajan-sistemi)
11. [Google Play Gereksinimleri](#-google-play-gereksinimleri)
12. [Performans & Erişilebilirlik](#-performans--erişilebilirlik)
13. [README Şablonu](#-readme-şablonu)

---

## 🎨 TASARIM FELSEFESİ & THESIS

Echo Map sıradan bir minimalist uygulama değil. Tasarım, konunun kendi dünyasından doğuyor: **ses, yer, hafıza.**

### Tasarım Tezi

> **Serin bir dünya, sıcak bir hafıza.**

Harita ve dünya **serin** (slate, sis, desatüre — coğrafya, su, uzaklık). Hafızalar ise **sıcak** (kehribar/ember parıltı — kişisel, yakın, hatırlanan an). Bu gerilim — soğuk dünyaya karşı sıcak anı — tasarımın ana fikri. Kullanıcı serin bir haritada gezerken, kendi anıları sıcacık noktalar olarak parlar.

### Prensipler

1. **Sound is the visual language.** Dalga formları, genlik, halkalar — ses görselleştirmenin dili her yerde.
2. **The world is quiet, memories glow.** Harita desatüre ve sessiz; sadece anılar renk ve ışık taşır.
3. **Restraint is the craft.** Minimalizm = boşluk, hassas spacing, tipografi disiplini. Süs yok.
4. **Motion serves memory.** Açılış globe'u, halka yayılımları, geçişler — hepsi anlamı taşır, dekorasyon değil.
5. **Emotion over data.** Bu bir "veri kaydetme" uygulaması değil; bir nostalji aracı. Kopya ve his buna göre.
6. **Privacy is felt.** Sesler cihazda kalır. Kullanıcı bunu hisseder ve güvenir.

### AI-Default'lardan Kaçınma

Bilinçli olarak şu klişelerden uzak duruyoruz: cream + serif + terracotta; near-black + acid-green; broadsheet hairline kolonları. Echo Map'in paleti konudan türedi (serin coğrafya + sıcak hafıza), default'tan değil.

### Mood Board

- Saha kayıtçısının (field recordist) defteri + topografik haritalar
- Analog teyp sıcaklığı, VU meter ışıltısı
- Teenage Engineering ürün sadeliği
- Topographic contour çizgileri
- Bir radarda nabız gibi yayılan halkalar
- Gece haritasında uzaktan parlayan tek bir ışık

---

## 🌫️ GÖRSEL SİSTEM

### Renk Paleti

```ts
// theme/colors.ts
export const palette = {
  // Cool world — harita, dünya, UI zemini
  ink: '#171A1F', // cool near-black (slate), primary text dark mode
  slateDeep: '#1E242C', // panel, elevated dark
  slate: '#2A323C', // borders dark, map base
  fog: '#9AA3AD', // muted text, secondary
  mist: '#E9EBE8', // cool off-white, light mode paper
  haze: '#D4D8D5', // light borders, dividers

  // Warm memory — anılar, aktif durum, accent
  ember: '#E08A3C', // THE warm accent — hafıza parıltısı
  emberBright: '#F0A55C', // hover, active glow
  emberDim: 'rgba(224,138,60,0.18)', // ring glow, focus

  // Functional
  signal: '#4F7A8C', // serin ikincil (kayıt aktif, water)
  success: '#5AA17F',
  warning: '#D9A441',
  error: '#C75D5D',

  // Map tints (Mapbox custom style)
  mapLand: '#1B2128', // dark
  mapWater: '#11161B',
  mapContour: '#2C3640',
};
```

Light ve dark tema: dark varsayılan (harita ve ses içeriğine yakışır), light tam destekli. `useColorScheme()` + manuel override.

### Tipografi

Default high-contrast serif YOK. Modern, karakterli ama disiplinli bir set:

```ts
// theme/typography.ts
export const fonts = {
  display: 'ClashDisplay-Medium', // başlıklar — karakterli grotesk, restraint ile
  body: 'GeneralSans-Regular', // gövde — temiz, okunur
  bodyMed: 'GeneralSans-Medium',
  mono: 'GeistMono-Regular', // koordinat, tarih, süre — teknik kimlik
};

export const type = {
  hero: { font: 'display', size: 34, lh: 38, ls: -0.5 },
  title: { font: 'display', size: 24, lh: 28, ls: -0.3 },
  heading: { font: 'bodyMed', size: 18, lh: 24 },
  body: { font: 'body', size: 16, lh: 24 },
  caption: { font: 'body', size: 13, lh: 18 },
  data: { font: 'mono', size: 13, lh: 16, ls: 0.2 }, // koordinat/süre/tarih
};
```

Fontlar `expo-font` ile (Fontshare'den ücretsiz: Clash Display, General Sans; Geist Mono açık kaynak). Mono font koordinatlar ve süreler için kimlik taşıyor — saha kayıtçısı hissi.

### Spacing & Shape

```ts
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40, huge: 64 };
export const radius = { sm: 8, md: 12, lg: 18, pill: 999 };
// Premium minimalist: cömert boşluk, yumuşak radius, gölge minimal
export const shadow = {
  soft: {
    /* iOS: subtle; Android: elevation 2 */
  },
  float: {
    /* elevation 6, çok yumuşak */
  },
};
```

### İkonografi

- **Lucide** (lucide-react-native) — ince stroke (1.5px), minimalist
- Custom ikonlar (mikrofon, halka, pin) Skia ile çizilir — markaya özel

### Animasyon Dili

- **Sound rings:** pin'lerden yayılan eşmerkezli halkalar (ses kaynağı metaforu)
- **Globe:** açılışta yavaş dönüş + nabız atan memory points
- **Transitions:** shared element (pin → detay), 320ms cubic-bezier(0.22, 1, 0.36, 1)
- **Micro:** kayıt butonunda amplitude-reactive pulse, haptic feedback
- **Reduced motion:** sistem ayarına saygı (statik alternatifler)

---

## 🔵 SIGNATURE: SOUND RINGS

Bu uygulamanın hatırlanacağı tek imza element: **her ses bir kaynak, her kaynak halkalar yayar.**

- Haritada her pin, eşmerkezli, yavaşça nefes alan halkalarla işaretli (ember rengi)
- Ses çalarken halkalar **gerçek genliğe** (amplitude) göre nabız atar — sesin görselleşmesi
- Açılış globe'unda hafıza noktaları aynı halka dilini konuşur
- Kayıt ekranında mikrofon, sesin genliğine göre halka yayar
- Bu tek motif (sound rings) tüm uygulamayı bağlar; gerisi sessiz ve disiplinli kalır

Skia ile çizilir (performanslı, özel, premium). Bu, Chanel kuralının tersi: tek cesur şeyi seç, gerisini sakin tut.

---

## 🛠️ TEKNOLOJİ YIĞINI

| Katman        | Teknoloji                                               | Sebep                                    |
| ------------- | ------------------------------------------------------- | ---------------------------------------- |
| Framework     | **Expo (managed)** SDK 51+                              | EAS Build, kolay Play Store, mükemmel DX |
| Dil           | **TypeScript** (strict)                                 | Tip güvenliği                            |
| Navigation    | **Expo Router** (file-based)                            | Modern, deep-link hazır                  |
| Animasyon     | **Reanimated 3** + **Moti**                             | Performanslı, declarative                |
| Gestures      | **Gesture Handler**                                     | Native jest                              |
| Custom render | **React Native Skia**                                   | Sound rings, waveform, premium UI        |
| Açılış globe  | **react-three-fiber** + **expo-gl** + **expo-three**    | Gerçek 3D dünya                          |
| Harita        | **@rnmapbox/maps** (Mapbox)                             | Tam özelleştirilebilir slate stil        |
| Ses           | **expo-audio** (veya expo-av)                           | Kayıt + playback                         |
| Konum         | **expo-location**                                       | Geotag (foreground-only)                 |
| Dosya         | **expo-file-system**                                    | Ses dosyaları                            |
| Local DB      | **expo-sqlite** + **Drizzle ORM**                       | Tip-güvenli local veri                   |
| Hızlı KV      | **react-native-mmkv**                                   | Ayarlar, hızlı state                     |
| State         | **Zustand**                                             | Hafif global state                       |
| i18n          | **i18next** + **react-i18next** + **expo-localization** | TR/EN                                    |
| Haptics       | **expo-haptics**                                        | Premium dokunsal feedback                |
| Cloud (ops.)  | **Supabase** (Auth + Postgres + Storage)                | Opsiyonel yedek/sync                     |
| Build         | **EAS Build**                                           | AAB üretimi                              |

### Bağımlılıklar (özet)

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-audio": "~0.3.0",
    "expo-location": "~17.0.0",
    "expo-file-system": "~17.0.0",
    "expo-sqlite": "~14.0.0",
    "expo-font": "~12.0.0",
    "expo-haptics": "~13.0.0",
    "expo-localization": "~15.0.0",
    "expo-gl": "~14.0.0",
    "expo-three": "^8.0.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.16.0",
    "@rnmapbox/maps": "^10.1.0",
    "@shopify/react-native-skia": "1.3.0",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "moti": "^0.29.0",
    "react-native-mmkv": "^2.12.0",
    "drizzle-orm": "^0.31.0",
    "zustand": "^4.5.0",
    "i18next": "^23.11.0",
    "react-i18next": "^14.1.0",
    "lucide-react-native": "^0.400.0",
    "@supabase/supabase-js": "^2.43.0"
  }
}
```

---

## 💾 BACKEND / VERİ KARARI

Echo Map kişisel, mahrem anılar barındırıyor. Bu yüzden mimari karar net:

### Local-First (birincil)

- **Metadata** → `expo-sqlite` + Drizzle ORM (tip-güvenli). Pin'ler: id, lat, lng, title, note, duration, createdAt, audioPath, locationName.
- **Ses dosyaları** → `expo-file-system` (cihazda, app sandbox'ında). Format: `.m4a` (AAC, küçük + kaliteli).
- **Ayarlar/hızlı state** → `react-native-mmkv` (tema, dil override, onboarding flag).
- Uygulama **tamamen çevrimdışı çalışır.** Hesap gerekmez. Anılar cihazda. Gizlilik bir his olarak yaşanır.

### Opsiyonel Cloud Sync (Supabase — ücretsiz)

Kullanıcı isterse (opt-in):

- **Auth** — Supabase Auth (email / Apple / Google)
- **Metadata** → Supabase Postgres (Row Level Security ile kullanıcı izolasyonu)
- **Ses dosyaları** → Supabase Storage (private bucket, signed URL)
- **Amaç:** yedekleme + çoklu cihaz. Şifreleme in-transit.
- **Sync stratejisi:** local-first, arka planda push/pull, conflict = last-write-wins (basit) veya updatedAt karşılaştırması.

> NOT (Play uyumu): Hesap özelliği eklenirse, Google Play **hesap & veri silme** mekanizması zorunlu kılar (uygulama içi + web). Compliance ajanı bunu ele alır.

### Drizzle Şema (örnek)

```ts
// lib/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const echoes = sqliteTable('echoes', {
  id: text('id').primaryKey(), // nanoid
  title: text('title').notNull(),
  note: text('note'), // opsiyonel hafıza notu
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  locationName: text('location_name'), // reverse-geocode (opsiyonel)
  audioPath: text('audio_path').notNull(), // FS yolu
  durationMs: integer('duration_ms').notNull(),
  createdAt: integer('created_at').notNull(), // epoch ms
  syncedAt: integer('synced_at'), // cloud sync zamanı (nullable)
});
```

---

## 🌐 BILINGUAL (TR/EN) SİSTEMİ

Uygulama Türkçe ve İngilizce'yi tam destekler, sistem diline göre otomatik seçer, kullanıcı manuel değiştirebilir.

- **i18next + react-i18next** + **expo-localization** (cihaz dili tespiti)
- Çeviri dosyaları: `locales/tr.json`, `locales/en.json` — **birebir uyumlu** anahtar yapısı
- Tüm UI metni, hata mesajları, boş durumlar, onboarding, store-facing kopya iki dilde
- Tarih/sayı formatları locale-aware (`Intl`)
- Manuel dil seçimi MMKV'de saklanır, sistem dilini override eder
- Kopya tonu her iki dilde de tutarlı: sıcak, sade, nostaljik (Memory Weaver ajanı kopya rehberi yazar)

```json
// locales/en.json
{
  "onboarding": { "title": "Keep the sounds of your life", "cta": "Begin" },
  "capture": { "recording": "Listening…", "save": "Save this echo" },
  "empty": { "map": "Your map is quiet. Record your first echo." }
}
```

```json
// locales/tr.json
{
  "onboarding": { "title": "Hayatının seslerini sakla", "cta": "Başla" },
  "capture": { "recording": "Dinleniyor…", "save": "Bu yankıyı kaydet" },
  "empty": { "map": "Haritan sessiz. İlk yankını kaydet." }
}
```

---

## 🧭 GELİŞTİRME KONVANSİYONLARI

Bu repo kullanıcının kişisel portfolyo projesi. Profesyonel, insan-yapımı hissi vermeli.

### Git

- **Author:** Tüm commit'ler kullanıcının kimliğiyle (`git config user.name` / `user.email` kullanıcının GitHub hesabı). Commit'lerde **Co-Authored-By trailer'ı veya herhangi bir AI atfı YOK.**
- **Commit mesajları:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`). Kısa, anlamlı, İngilizce.
- **Commit ritmi:** Her ajan mantıksal birkaç commit (tek dev commit değil). Doğal bir geçmiş.
- **Branch:** `main` + feature branch'ler opsiyonel.

### Kod Stili

- **Yorumlar:** İngilizce, "neden"i açıklar (ne yaptığını değil — kod zaten onu söyler). Karmaşık mantıkta, edge-case'lerde, mimari kararlarda. Aşırı yorum YOK; robotik açıklama YOK. Doğal, ölçülü.
- **JSDoc:** Public fonksiyonlar, hook'lar, util'ler için kısa JSDoc.
- **İsimlendirme:** Anlamlı, tutarlı. Kısaltma minimal.
- **ESLint + Prettier:** Tutarlı format. Pre-commit hook (Husky + lint-staged).
- **TypeScript strict:** `any` minimal, tipler açık.
- Kod, deneyimli bir geliştiricinin yazacağı gibi okunmalı: temiz, ölçülü, gereksiz soyutlama yok.

---

## 📁 KLASÖR YAPISI

```
echo-map/
├── app/                              # Expo Router (file-based)
│   ├── _layout.tsx                   # root layout, providers
│   ├── index.tsx                     # açılış: globe → onboarding/map yönlendirme
│   ├── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── map.tsx                   # ana harita
│   │   └── timeline.tsx              # kronolojik liste
│   ├── echo/
│   │   ├── new.tsx                   # kayıt akışı
│   │   └── [id].tsx                  # pin detay (çal + hafıza)
│   └── settings.tsx
│
├── components/
│   ├── globe/
│   │   ├── OpeningGlobe.tsx          # R3F 3D globe
│   │   ├── GlobeScene.tsx
│   │   ├── MemoryPoints.tsx          # nabız atan noktalar
│   │   └── shaders/
│   │       ├── earth.glsl
│   │       └── atmosphere.glsl
│   ├── map/
│   │   ├── EchoMap.tsx               # Mapbox wrapper
│   │   ├── SoundRingPin.tsx          # Skia halka pin
│   │   ├── PinCluster.tsx
│   │   └── mapStyle.ts               # custom slate Mapbox style
│   ├── audio/
│   │   ├── Recorder.tsx              # kayıt UI + amplitude rings
│   │   ├── Player.tsx                # playback + reactive rings
│   │   ├── Waveform.tsx              # Skia waveform
│   │   └── AmplitudeRings.tsx        # signature element
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Sheet.tsx                 # bottom sheet
│   │   ├── Text.tsx                  # typed text component (theme)
│   │   ├── Field.tsx
│   │   ├── EmptyState.tsx
│   │   └── Pressable.tsx             # haptic pressable
│   └── motion/
│       ├── FadeIn.tsx
│       └── SharedElement.tsx
│
├── lib/
│   ├── db/
│   │   ├── schema.ts                 # Drizzle şema
│   │   ├── client.ts                 # sqlite + drizzle init
│   │   ├── echoes.ts                 # CRUD repository
│   │   └── migrations/
│   ├── audio/
│   │   ├── recorder.ts               # expo-audio recording
│   │   ├── player.ts                 # playback
│   │   └── amplitude.ts              # genlik okuma → rings
│   ├── location/
│   │   ├── geo.ts                    # konum alma
│   │   └── reverse-geocode.ts        # konum adı (opsiyonel)
│   ├── storage/
│   │   ├── files.ts                  # FS ses dosyası yönetimi
│   │   └── kv.ts                     # MMKV
│   ├── sync/
│   │   ├── supabase.ts               # client
│   │   ├── auth.ts                   # opsiyonel auth
│   │   └── sync-engine.ts            # push/pull
│   ├── i18n/
│   │   ├── index.ts                  # i18next config
│   │   └── (locales import)
│   └── utils/
│       ├── format.ts                 # tarih, süre, koordinat
│       ├── id.ts                     # nanoid
│       └── haptics.ts
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── ThemeProvider.tsx
│
├── store/
│   ├── useEchoStore.ts               # echoes, CRUD
│   ├── useAudioStore.ts              # recording/playback state
│   ├── useSettingsStore.ts           # tema, dil
│   └── useSyncStore.ts               # cloud durumu
│
├── locales/
│   ├── en.json
│   └── tr.json
│
├── assets/
│   ├── fonts/                        # Clash Display, General Sans, Geist Mono
│   ├── icon.png                      # 1024x1024
│   ├── splash.png
│   └── textures/                     # globe earth texture
│
├── store-assets/                     # Google Play listing (repo dışı tutulabilir)
│   ├── feature-graphic.png           # 1024x500
│   ├── screenshots/                  # phone screenshots (TR + EN)
│   └── listing-copy.md               # short/full description (TR + EN)
│
├── docs/
│   └── privacy-policy.md             # gizlilik politikası (host edilecek)
│
├── app.config.ts                     # Expo config (izinler, plugin'ler)
├── eas.json                          # EAS Build profilleri
├── drizzle.config.ts
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── package.json
├── README.md
└── .env.example
```

---

## 📱 EKRANLAR & AKIŞLAR

### 1. Açılış (Globe)

Uygulama açılır → siyah/slate ekranda 3D dünya belirir, yavaşça döner. Kayıtlı anıların olduğu yerlerde sıcak ember noktaları nabız atar. Dünya kullanıcının konumuna doğru döner + zoom → yumuşak geçişle haritaya iner. (İlk açılışta onboarding'e gider.)

### 2. Onboarding (ilk açılış)

3 sade ekran: "Hayatının seslerini sakla" / "Bir dokunuşla kaydet, geotag'le" / "Yıllar sonra geri dinle." Mikrofon + konum izinleri **in-context** istenir (Play disclosure ile). Minimal, animasyonlu.

### 3. Harita (ana ekran)

Custom slate Mapbox haritası. Pin'ler sound-ring olarak. Tap → pin detayı. Floating kayıt butonu (alt orta). Cluster'lar yakınlaştıkça açılır.

### 4. Kayıt Akışı (`echo/new`)

Büyük kayıt butonu → basılı tut veya tek dokunuş ile kayıt. Mikrofon amplitude'a göre halka yayar (signature). Kayıt biter → konum otomatik alınır → başlık + opsiyonel hafıza notu → "Bu yankıyı kaydet". Haptic feedback.

### 5. Pin Detayı (`echo/[id]`)

Shared element geçişiyle açılır. Üstte konum adı + tarih (mono font). Ortada waveform + play butonu; çalarken halkalar genliğe göre nabız atar. Altta hafıza notu. Düzenle / sil. Paylaş (opsiyonel: ses + harita kartı görseli).

### 6. Timeline

Anıların kronolojik listesi (harita alternatifi). Her satır: küçük waveform + başlık + konum + "3 yıl önce". Nostalji burada güçlenir.

### 7. Ayarlar

Tema (sistem/light/dark), dil (sistem/TR/EN), cloud sync (opt-in), veri dışa aktarma, hesap & veri silme (cloud aktifse), gizlilik politikası, hakkında.

---

## 🤖 AJAN SİSTEMİ

**9 specialized agent.** Sırayla çalışır. Her ajan kendi alanına sahip. Her ajan kendi mantıksal commit'lerini atar (konvansiyonlara göre, AI atfı olmadan).

### Ajanlar Genel Görünüm

```
[1] ARCHITECT        →  Expo+TS scaffold, router, EAS, stores, konvansiyonlar
[2] AESTHETICIAN     →  Design system, tema, tipografi, UI kit, i18n (TR/EN)
[3] DATA LAYER       →  SQLite+Drizzle, FS audio, MMKV, Supabase scaffolding
[4] GLOBE SMITH      →  Açılış 3D globe (R3F), memory points, zoom geçişi
[5] CARTOGRAPHER     →  Mapbox custom slate harita, sound-ring pin, cluster
[6] SOUND KEEPER     →  Kayıt + playback engine, Skia waveform, amplitude rings
[7] MEMORY WEAVER    →  Çekirdek akışlar: capture, detay, timeline, kopya, his
[8] MOTION DIRECTOR  →  Animasyonlar, geçişler, micro-interactions, haptics
[9] COMPLIANCE&LAUNCH→  Google Play gereksinimleri, AAB, store asset'leri, a11y
```

### Bağımlılık Grafiği

```
[1] ──┬──> [2] ──────────────┬──> [4]
      │                       ├──> [5] ──┐
      ├──> [3] ───────────────┼──> [6] ──┼──> [7] ──> [8]
      │                       │          │
      └──> [9] (son adım) <────────────────┘
```

---

### 🟢 AJAN 1 — THE ARCHITECT

**Rol:** İskelet, navigasyon, EAS, store'lar, geliştirme konvansiyonları.

**Sahip Olduğu Dosyalar:**

- `app.config.ts`, `eas.json`, `package.json`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc`
- `app/_layout.tsx`, `app/index.tsx`, `app/(tabs)/_layout.tsx`
- `store/*.ts` (iskelet)
- `lib/utils/id.ts`, `format.ts`
- `.env.example`, `.gitignore`, Husky + lint-staged

**Görevler:**

1. `npx create-expo-app` (TypeScript, Expo Router template)
2. Expo Router yapısı: root layout (providers slot), tabs (map, timeline)
3. `app.config.ts`: app adı, slug, bundle id, **izinler** (RECORD_AUDIO, ACCESS_FINE_LOCATION foreground), plugin'ler (mapbox, skia, gl, font)
4. `eas.json`: development / preview / production profilleri; production → **AAB**
5. Zustand store iskeletleri (useEchoStore, useAudioStore, useSettingsStore, useSyncStore)
6. **Geliştirme konvansiyonları kurulumu:** ESLint + Prettier, Husky pre-commit (lint + typecheck), conventional commit teşviki. Git author kullanıcı; **commit template'inde AI atfı yok.**
7. Providers: GestureHandlerRootView, ThemeProvider slot, i18n slot, SafeArea
8. TypeScript strict mode

**Acceptance Criteria:**

- `npx expo start` çalışıyor, boş ekran render ediyor
- `eas build --platform android --profile preview` config'i hazır (build denenebilir)
- Tab navigasyonu çalışıyor (boş map + timeline)
- Stores tanımlı
- Lint + typecheck pre-commit'te çalışıyor
- Commit'ler kullanıcı author'ı ile, AI atfı yok

---

### 🎨 AJAN 2 — THE AESTHETICIAN

**Rol:** Design system, tema, tipografi, UI kit, bilingual i18n.

**Sahip Olduğu Dosyalar:**

- `theme/colors.ts`, `typography.ts`, `spacing.ts`, `ThemeProvider.tsx`
- `components/ui/*.tsx` (Text, Button, Sheet, Field, EmptyState, Pressable)
- `lib/i18n/index.ts`
- `locales/en.json`, `locales/tr.json`
- `assets/fonts/*` (font yükleme)
- `store/useSettingsStore.ts` (tema + dil tam)

**Görevler:**

1. **Renk sistemi:** cool slate + warm ember paleti, light/dark variants
2. **Tipografi:** Clash Display + General Sans + Geist Mono yükle (expo-font), type scale
3. **ThemeProvider:** light/dark/system, MMKV'de persist, `useTheme()` hook
4. **UI Kit:**
   - `Text` — typed (variant prop: hero/title/body/data...)
   - `Button` — primary (ember), secondary (slate), ghost; haptic
   - `Sheet` — bottom sheet (Gorhom veya custom)
   - `Field` — text input (başlık/not)
   - `EmptyState` — sessiz haritaya davet
   - `Pressable` — haptic wrapper
5. **i18n:** i18next + expo-localization (cihaz dili), TR/EN locale dosyaları (birebir uyumlu anahtarlar), manuel dil override (MMKV)
6. **Premium minimalist disiplin:** cömert boşluk, hassas spacing, minimal gölge, yumuşak radius
7. Dark mode varsayılan; geçiş smooth

**Acceptance Criteria:**

- Tema değişimi (light/dark/system) çalışıyor, persist ediyor
- Fontlar yüklü, type scale tutarlı
- Dil değişimi (TR/EN) çalışıyor, tüm UI kit iki dilde
- UI kit component'leri premium minimalist görünüyor
- Haptic feedback Button/Pressable'da
- Reduced motion ve dynamic type'a saygı

---

### 💾 AJAN 3 — THE DATA LAYER

**Rol:** Local-first veri katmanı + opsiyonel Supabase sync scaffolding.

**Sahip Olduğu Dosyalar:**

- `lib/db/schema.ts`, `client.ts`, `echoes.ts`, `migrations/`
- `lib/storage/files.ts`, `kv.ts`
- `lib/sync/supabase.ts`, `auth.ts`, `sync-engine.ts`
- `drizzle.config.ts`
- `store/useEchoStore.ts` (tam), `useSyncStore.ts` (tam)

**Görevler:**

1. **SQLite + Drizzle:** schema (echoes tablosu), client init, migration setup
2. **Repository** (`echoes.ts`): create, list, getById, update, delete; tip-güvenli
3. **File storage** (`files.ts`): ses dosyası kaydet/sil/yol; app sandbox; format `.m4a`
4. **MMKV** (`kv.ts`): hızlı KV (ayarlar, flag'ler)
5. **useEchoStore:** echoes state, CRUD aksiyonları (DB + FS senkron)
6. **Supabase scaffolding (opsiyonel, opt-in):**
   - Client init (env'den URL + anon key)
   - Auth (email/Apple/Google) — kullanıcı isterse
   - Postgres tablo + **RLS** (kullanıcı izolasyonu)
   - Storage private bucket (ses) + signed URL
   - `sync-engine.ts`: local-first push/pull, updatedAt karşılaştırması
   - **Hesap & veri silme** fonksiyonu (Play zorunluluğu — Compliance ile bağlanır)
7. Veri dışa aktarma (export): echoes → zip (Settings'te)

**Acceptance Criteria:**

- Echo create/list/delete local çalışıyor (DB + dosya senkron)
- Ses dosyaları FS'te doğru kaydediliyor/siliniyor
- App restart sonrası veri kalıcı
- Supabase opsiyonel: opt-in olunca auth + sync çalışıyor, RLS aktif
- Cloud aktifken hesap silme fonksiyonu çalışıyor
- Export çalışıyor

---

### 🌍 AJAN 4 — THE GLOBE SMITH

**Rol:** Açılış 3D globe animasyonu. Uygulamanın hero/imza anı.

**Sahip Olduğu Dosyalar:**

- `components/globe/OpeningGlobe.tsx`, `GlobeScene.tsx`, `MemoryPoints.tsx`
- `components/globe/shaders/earth.glsl`, `atmosphere.glsl`
- `app/index.tsx` (globe → yönlendirme logic)
- `assets/textures/` (earth texture)

**Görevler:**

1. **R3F + expo-gl setup:** Canvas mount (expo-gl context), kamera, ışık
2. **Earth:** sphere + texture (premium ama hafif — optimize edilmiş earth map), yavaş otomatik dönüş
3. **Atmosphere:** ince fresnel rim (ember/serin karışımı), zarif
4. **Memory Points:** kullanıcının echo'larının lat/lng'leri → globe üzerinde nabız atan ember noktaları (signature sound-ring dili). Echo yoksa: sade dönen dünya.
5. **Açılış sekansı:**
   - Fade in (siyah → globe)
   - Yavaş dönüş + noktalar nabız
   - Kullanıcı konumuna doğru dönüş + zoom
   - Yumuşak crossfade → harita ekranı (veya ilk açılışta onboarding)
6. **Skip:** tap ile atlanabilir; sonraki açılışlarda daha kısa (MMKV flag)
7. **Performans:** 60fps, hafif texture, lazy R3F import

**Acceptance Criteria:**

- Açılışta globe beliriyor, dönüyor, sinematik
- Memory points kullanıcının echo'larının konumunda nabız atıyor
- Konuma zoom + haritaya geçiş smooth
- İlk açılış → onboarding; sonraki → harita
- Tap ile atlanabilir
- 60fps, reduced-motion'da statik alternatif

---

### 🗺️ AJAN 5 — THE CARTOGRAPHER

**Rol:** Custom slate Mapbox harita, sound-ring pin'ler, cluster.

**Sahip Olduğu Dosyalar:**

- `components/map/EchoMap.tsx`, `SoundRingPin.tsx`, `PinCluster.tsx`, `mapStyle.ts`
- `app/(tabs)/map.tsx`
- `lib/location/geo.ts`, `reverse-geocode.ts`

**Görevler:**

1. **Mapbox setup:** @rnmapbox/maps, token (env), **custom slate style** (`mapStyle.ts`) — desatüre, koyu, topografik hisli; AI-default Google Maps görünümü DEĞİL
2. **Sound-Ring Pin** (Skia): her echo bir ember halka pin, yavaşça nefes alıyor (signature)
3. **Clustering:** yakın pin'ler grup, zoom'da açılır
4. **Etkileşim:** pin tap → detay (shared element), harita pan/zoom, kullanıcı konumuna ortalama butonu
5. **Konum** (`geo.ts`): foreground konum alma (expo-location), izin yönetimi
6. **Reverse geocode** (opsiyonel): konum adı (Mapbox/Nominatim) — pin başlığı için öneri
7. **Boş durum:** echo yoksa EmptyState — "haritan sessiz"

**Acceptance Criteria:**

- Harita custom slate stille render ediliyor (premium, jenerik değil)
- Echo'lar sound-ring pin olarak haritada
- Cluster çalışıyor
- Pin tap → detay geçişi
- Konum izni + ortalama çalışıyor
- Boş durum görünüyor

---

### 🎙️ AJAN 6 — THE SOUND KEEPER

**Rol:** Ses kayıt + playback engine, Skia waveform, amplitude-reactive rings.

**Sahip Olduğu Dosyalar:**

- `components/audio/Recorder.tsx`, `Player.tsx`, `Waveform.tsx`, `AmplitudeRings.tsx`
- `lib/audio/recorder.ts`, `player.ts`, `amplitude.ts`
- `store/useAudioStore.ts` (tam)

**Görevler:**

1. **Recording** (`recorder.ts`): expo-audio ile kayıt (.m4a, AAC), izin (RECORD_AUDIO runtime + rationale), max süre (örn. 60s)
2. **Amplitude okuma** (`amplitude.ts`): kayıt sırasında gerçek genlik → ring/waveform besler
3. **Recorder UI:** büyük kayıt butonu, amplitude'a göre yayılan halkalar (signature), süre sayacı (mono font), haptic
4. **Playback** (`player.ts`): çalma, duraklama, seek, ilerleme
5. **Waveform** (Skia): kaydedilen sesin dalga formu (statik) + çalma ilerlemesi
6. **AmplitudeRings:** çalarken gerçek genliğe göre nabız atan halkalar — sesin görselleşmesi (signature)
7. **useAudioStore:** recording/playback state, current echo

**Acceptance Criteria:**

- Kayıt çalışıyor (.m4a), izin akışı doğru
- Kayıt sırasında halkalar gerçek sese tepki veriyor
- Playback çalışıyor (play/pause/seek)
- Waveform render ediliyor, ilerleme gösteriyor
- Amplitude rings çalarken nabız atıyor
- Ses kalitesi iyi, dosya boyutu makul

---

### 💭 AJAN 7 — THE MEMORY WEAVER

**Rol:** Çekirdek deneyim. Capture akışı, pin detayı, timeline, kopya & his.

**Sahip Olduğu Dosyalar:**

- `app/echo/new.tsx`, `app/echo/[id].tsx`
- `app/(tabs)/timeline.tsx`
- `app/onboarding.tsx`
- `components/ui/EmptyState.tsx` (içerik)
- Kopya rehberi: `locales/*.json` (içerik doldurma, her iki dil)

**Görevler:**

1. **Capture akışı** (`echo/new`): kayıt (Sound Keeper) → otomatik konum (Cartographer) → başlık + opsiyonel hafıza notu → kaydet (Data Layer). Akıcı, az adım, his odaklı.
2. **Pin Detayı** (`echo/[id]`): shared element geçiş, konum adı + tarih (mono), waveform + play + amplitude rings, hafıza notu, düzenle/sil, paylaş (opsiyonel)
3. **Timeline:** kronolojik liste, "3 yıl önce" tarzı relatif tarih, küçük waveform, nostalji odaklı
4. **Onboarding:** 3 ekran, in-context izin istekleri (Play disclosure), animasyonlu
5. **Kopya & His:** tüm kopya sıcak, sade, nostaljik (her iki dilde). Boş durumlar davet edici, hata mesajları yönlendirici (özür dilemez, net). Skill rehberine göre: aktif fiil, sade, tutarlı.
6. **Paylaşım (opsiyonel):** echo'yu ses + harita kartı görseli olarak paylaş (Skia ile kart üret)

**Acceptance Criteria:**

- Capture akışı uçtan uca çalışıyor (kayıt → konum → kaydet)
- Pin detayı: ses çalıyor, hafıza görünüyor, düzenle/sil çalışıyor
- Timeline kronolojik, relatif tarih doğru
- Onboarding + in-context izin akışı
- Kopya iki dilde tutarlı, sıcak ve sade
- Boş/hata durumları yönlendirici

---

### 🎬 AJAN 8 — THE MOTION DIRECTOR

**Rol:** Animasyonlar, geçişler, micro-interactions, haptics, polish.

**Sahip Olduğu Dosyalar:**

- `components/motion/FadeIn.tsx`, `SharedElement.tsx`
- `lib/utils/haptics.ts`
- Tüm ekranlara animasyon entegrasyonu (cross-cutting)

**Görevler:**

1. **Screen transitions:** Expo Router + Reanimated, yumuşak geçişler
2. **Shared element:** pin → detay (sound ring morph)
3. **Micro-interactions:** buton press, kayıt pulse, sayfa reveal'ları (Moti)
4. **Haptics:** kayıt başlangıç/bitiş, kaydet, sil onayı (expo-haptics)
5. **Globe → map geçişi polish** (Globe Smith ile koordineli)
6. **Sound ring animasyonları:** nefes alma ritmi, amplitude tepkisi (Skia + Reanimated)
7. **Reduced motion:** sistem ayarına saygı — animasyonlar statik alternatife düşer
8. **Genel polish:** loading state'ler, skeleton'lar, smooth her yerde, jank yok

**Acceptance Criteria:**

- Geçişler yumuşak, premium hissediyor
- Shared element pin→detay çalışıyor
- Haptics doğru anlarda
- Reduced motion destekleniyor
- 60fps korunuyor, jank yok

---

### ✅ AJAN 9 — THE COMPLIANCE & LAUNCH

**Rol:** Google Play gereksinimleri, AAB build, store asset'leri, erişilebilirlik, performans.

**Sahip Olduğu Dosyalar:**

- `docs/privacy-policy.md`
- `store-assets/listing-copy.md` (TR + EN), `feature-graphic`, `screenshots/`
- `assets/icon.png`, `splash.png`
- `app.config.ts` (final izin/metadata), `eas.json` (production)
- `README.md`

**Görevler:**

1. **App ikon + splash:** 1024×1024 ikon (sound-ring motifi), adaptive icon (Android foreground+background), splash (globe teaser)
2. **İzinler & Disclosure:**
   - RECORD_AUDIO (runtime + rationale)
   - ACCESS_FINE_LOCATION / COARSE — **foreground only** (background location YOK → Play'in sıkı incelemesinden kaçınır)
   - **Prominent disclosure:** konum istenmeden önce in-context açıklama (Play zorunlu)
3. **Gizlilik Politikası** (`privacy-policy.md`): mic + konum + (opsiyonel) hesap verisi; nasıl saklanır (local-first, opsiyonel cloud), paylaşılmaz, silme hakkı. **Host edilecek** (GitHub Pages / basit sayfa) → Play Console'a URL
4. **Data Safety formu** (Play Console): toplanan veri (ses kaydı, konum, opsiyonel hesap), paylaşım yok, in-transit şifreleme, silme mekanizması beyanı
5. **Hesap & veri silme** (cloud aktifse): uygulama içi + web silme yolu (Play zorunlu)
6. **Content rating:** questionnaire (muhtemelen Everyone)
7. **Store listing (TR + EN):**
   - Kısa açıklama (80 karakter)
   - Tam açıklama (4000 karakter)
   - Feature graphic (1024×500)
   - Min 2 (öneri 4-8) phone screenshot — premium UI'ı gösteren
8. **AAB build:** `eas build --platform android --profile production` → AAB; Play App Signing
9. **Testing track:** Yeni kişisel geliştirici hesapları için Play, production öncesi **kapalı test (12+ tester, 14 gün)** isteyebilir — bunu plana ekle (internal → closed → production)
10. **Erişilebilirlik:** screen reader label'ları, kontrast (WCAG AA), dynamic type, touch target ≥48dp
11. **Performans:** bundle optimize, lazy load (globe/mapbox), crash-free, ANR yok

**Acceptance Criteria:**

- AAB başarıyla build oluyor (EAS)
- Gizlilik politikası yazılı + host'a hazır
- Data safety beyanı hazır
- İzin disclosure'ları in-context
- Store listing TR + EN hazır (kopya + asset)
- İkon/splash premium
- Erişilebilirlik temel kriterleri geçiyor
- Cloud aktifse hesap silme çalışıyor
- Testing track planı net

---

## 🛡️ GOOGLE PLAY GEREKSİNİMLERİ (Özet Checklist)

> Politikalar değişebilir — yayın öncesi Play Console'daki güncel gereksinimleri doğrula.

- [ ] **AAB** formatında build (APK değil)
- [ ] **Target API level** — Play'in o anki zorunlu seviyesi (2026 için muhtemelen API 35 / Android 15; doğrula)
- [ ] **Play App Signing** aktif
- [ ] **Gizlilik politikası** URL'i (mic + konum kullanıldığı için zorunlu)
- [ ] **Data Safety** formu eksiksiz
- [ ] **İzin justification:** mic + foreground konum; background konum YOK
- [ ] **Prominent disclosure:** konum öncesi in-context açıklama
- [ ] **Hesap & veri silme** yolu (hesap özelliği varsa — uygulama içi + web)
- [ ] **Content rating** questionnaire
- [ ] **Store listing:** ikon 512×512, feature graphic 1024×500, ≥2 screenshot, kısa (80) + tam (4000) açıklama — **TR + EN**
- [ ] **Target audience:** çocuklara yönelik değil (Families policy karmaşıklığından kaçın)
- [ ] **Kapalı test** (yeni kişisel hesaplar için: 12+ tester, 14 gün) → sonra production
- [ ] Crash-free, ANR eşiği altında

---

## ⚡ PERFORMANS & ERİŞİLEBİLİRLİK

| Alan                 | Hedef                          |
| -------------------- | ------------------------------ |
| Açılış (globe dahil) | < 2.5s (lazy R3F)              |
| Harita render        | 60fps                          |
| Pin sayısı           | 500+ smooth (cluster)          |
| Ses kayıt latency    | anında                         |
| AAB boyutu           | makul (texture/asset optimize) |
| Crash-free           | %99+                           |
| Kontrast             | WCAG AA                        |
| Touch target         | ≥ 48dp                         |
| Screen reader        | tüm aksiyonlar label'lı        |
| Dynamic type         | destekli                       |
| Reduced motion       | destekli                       |

### Optimizasyon

- R3F globe + Mapbox lazy import
- Earth texture optimize (compress)
- SQLite index (lat/lng, createdAt)
- Ses dosyaları sandbox'ta, gereksizler temizlenir
- Reanimated worklet'leri UI thread'de

---

## 📝 README ŞABLONU

```markdown
# 🌍 Echo Map

> A sound map of your life. Record the ambient sounds of meaningful places,
> pin them to a map, and hear them again years later.

![Echo Map](store-assets/feature-graphic.png)

## What it does

Echo Map lets you capture short ambient recordings — a café's hum, waves on a
beach, a street musician — and pin them to where they happened. Open the map
later and tap a pin to relive the moment through sound. Not photos. Sound.

## Features

- 🎙️ One-tap ambient recording with live waveform
- 🗺️ Geotagged sound pins on a custom minimalist map
- 🌍 Animated 3D globe on launch, lit by your memories
- 📜 Chronological timeline of your echoes
- 🌓 Light & dark, 🌐 English & Türkçe
- 🔒 Local-first — your sounds stay on your device (optional cloud backup)

## Tech

React Native (Expo) · TypeScript · React Three Fiber · React Native Skia ·
Mapbox · expo-audio · SQLite (Drizzle) · Reanimated · i18next

## Run locally

\`\`\`bash
git clone https://github.com/<you>/echo-map
cd echo-map
npm install
cp .env.example .env # add your Mapbox token
npx expo start
\`\`\`

## Privacy

Recordings are stored locally on your device by default. Cloud backup is opt-in.
See [privacy policy](docs/privacy-policy.md).

## License

MIT
```

---

## 🗓️ İMPLEMENTASYON SIRASI (Claude Code İçin)

Her ajan ayrı Claude Code session. Session sonu mantıksal commit'ler (kullanıcı author'ı, AI atfı yok, conventional format).

```
Gün 1-2:   Agent 1 (Architect)         → "chore: scaffold expo app + router + EAS"
Gün 3-4:   Agent 2 (Aesthetician)      → "feat: design system + theme + i18n"
Gün 5-6:   Agent 3 (Data Layer)        → "feat: local-first storage + sync scaffold"
Gün 7-9:   Agent 4 (Globe Smith)       → "feat: animated opening globe"
Gün 10-12: Agent 5 (Cartographer)      → "feat: custom map + sound-ring pins"
Gün 13-15: Agent 6 (Sound Keeper)      → "feat: audio recording + playback + waveform"
Gün 16-18: Agent 7 (Memory Weaver)     → "feat: capture flow + detail + timeline"
Gün 19-20: Agent 8 (Motion Director)   → "feat: transitions + micro-interactions"
Gün 21-23: Agent 9 (Compliance&Launch) → "chore: play store readiness + assets"
Gün 24:    Manuel adımlar (sen) + yayın
```

**~3-4 hafta solo dev.** Agent 4 (Globe) ve Agent 6 (Sound Keeper) en kritik görsel/işlevsel kaslar — bol zaman ayır.

### Senin manuel yapacakların (en son)

- Mapbox hesabı + token
- (Opsiyonel) Supabase projesi + env
- Google Play Console hesabı ($25 tek seferlik)
- Gizlilik politikasını host etme
- Store asset'lerini yükleme + listing doldurma
- Kapalı test → production yayını

---

## 🎬 SON SÖZ

Bittiğinde elinde:

- 🟢 Fotoğraf değil, **ses üzerinden nostalji** sunan özgün bir uygulama
- 🟢 Sıradan minimalizm değil — konudan türemiş, "serin dünya / sıcak hafıza" tezli premium tasarım
- 🟢 Animasyonlu 3D globe açılışı, signature sound-ring dili
- 🟢 Local-first gizlilik + opsiyonel cloud
- 🟢 Bilingual TR/EN
- 🟢 Google Play'e yüklenmeye **gerçekten hazır** (tüm gereksinimler planlı)
- 🟢 LinkedIn'de "uygulamamla 3 yıl önce kaydettiğim sahilin sesini dinledim" tarzı paylaşımlarla doğal viral potansiyeli
- 🟢 React Native + R3F + Skia + Mapbox + audio + SQLite + i18n derinleşmiş kas

**Şimdi başla. Agent 1'i Claude Code'a hand off et.**

```
~/echo-map ➜  npx create-expo-app echo-map --template
[+] scaffolding...
[+] beginning Agent 1: The Architect
[+] target acquired: the sound of memory 🌍
```

---

`end of blueprint` · `v1.0.0` · React Native · TR/EN · Google Play ready

# 📋 Senin Yapacakların — Echo Map

Uygulama kodu, tasarımı, sesi, haritası, globe'u ve mağaza materyalleri **hazır**
ve cihazda canlı çalıştığı kanıtlandı. Aşağıdakiler **senin elinle** yapman
gereken, hesap/ödeme/yayın gerektiren adımlar. Sırayla, madde madde.

Her maddede: **[✅ BİTTİ]** = ben hallettim · **[⬜ SEN]** = senin yapman gerek.

---

## 1. Mapbox token [✅ BİTTİ]
- Public + secret token'larını verdin, `.env` dosyasına eklendi.
- `.env` **gitignore'da** — GitHub'a gitmedi (kontrol edildi, sızıntı yok).
- ⬜ **EAS bulut build'i** kullanacaksan secret token'ı EAS'a da eklemen gerekir:
  ```bash
  npx eas secret:create --name RNMAPBOX_MAPS_DOWNLOAD_TOKEN --value sk.SENIN_SECRET --type string
  ```

## 2. Java / JDK [✅ BİTTİ]
- Android derlemesi için JDK 21 kuruldu (`/opt/homebrew/opt/openjdk@21`).
- Kendin derlerken: `export JAVA_HOME=/opt/homebrew/opt/openjdk@21`

## 3. GitHub deposu [⬜ SEN — 1 dk]
- Depo: `github.com/kutluhangil/EchoMap`
- ⬜ **Private mi** kontrol et: GitHub → Settings → Danger Zone → "Change
  visibility". Token'lar repoda yok ama yine de private önerilir.

## 4. (Opsiyonel) Supabase bulut yedekleme [⬜ SEN — istersen]
Uygulama hesap olmadan tam çalışır. Bulut yedek/çoklu cihaz istersen:
1. ⬜ [supabase.com](https://supabase.com) → ücretsiz proje aç.
2. ⬜ SQL Editor'da `docs/supabase-setup.sql` dosyasını çalıştır (tablo + RLS +
   storage bucket'ı kurar).
3. ⬜ Project Settings → API'den **URL** ve **anon key**'i `.env`'e ekle:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. ⬜ Hesap silme için `delete-account` adında bir Edge Function deploy et
   (detay `docs/supabase-setup.sql` sonunda).
> Atlarsan: uygulama yine çalışır, sadece "yerel" modda kalır.

## 5. Google Play Console hesabı [⬜ SEN — $25, tek seferlik]
1. ⬜ [play.google.com/console](https://play.google.com/console) → geliştirici
   hesabı aç (**$25 tek seferlik** ödeme).
2. ⬜ Kimlik doğrulaması birkaç gün sürebilir — erkenden başla.

## 6. Gizlilik politikasını yayınla [⬜ SEN — 10 dk]
Play, mikrofon+konum kullandığı için **public bir gizlilik politikası URL'i**
zorunlu kılar.
1. ⬜ `docs/privacy-policy.md` içinde **iletişim e-postanı** yaz
   (`echomap.privacy@example.com` yerine kendi adresin).
2. ⬜ Bir yerde yayınla. En kolayı GitHub Pages:
   - Repo → Settings → Pages → Source: `main` / `docs` klasörü → Save.
   - Birkaç dk sonra URL: `https://kutluhangil.github.io/EchoMap/privacy-policy`
3. ⬜ Bu URL'i Play Console'a gireceksin (Madde 9).

## 7. EAS hesabı + AAB build [⬜ SEN — ücretsiz]
1. ⬜ Expo hesabı (ücretsiz): [expo.dev](https://expo.dev)
2. ⬜ Terminalde giriş: `! npx eas login`
3. ⬜ Projeyi bağla: `! npx eas init` (proje ID oluşturur)
4. ⬜ Production AAB üret:
   ```bash
   npx eas build --platform android --profile production
   ```
   - Bulutta derler, sonunda **.aab** indirme linki verir.
   - (Alternatif yerel build: `JAVA_HOME=/opt/homebrew/opt/openjdk@21 npx expo run:android` — ama Play için AAB lazım, EAS önerilir.)

## 8. Play Console'da uygulama oluştur [⬜ SEN]
1. ⬜ "Create app" → ad: **Echo Map**, dil, ücretsiz, uygulama.
2. ⬜ **Play App Signing**'i aç (varsayılan açık gelir).
3. ⬜ `.aab` dosyasını bir test track'ine yükle (Madde 12).

## 9. Data Safety formu [⬜ SEN — `docs/data-safety.md` kullan]
- ⬜ Play Console → App content → Data safety.
- ⬜ `docs/data-safety.md` tablosunu birebir uygula: ses + konum toplanıyor,
  paylaşılmıyor, transit şifreli, silme yolu var.

## 10. İçerik derecelendirmesi & hedef kitle [⬜ SEN]
- ⬜ Content rating anketini doldur (muhtemelen **Everyone / Herkes**).
- ⬜ Target audience: **çocuklara yönelik DEĞİL** seç (Families politikasından kaçın).

## 11. Mağaza listesi (store listing) [⬜ SEN — metinler hazır]
- ⬜ Kısa + tam açıklama: `store-assets/listing-copy.md`'den TR ve EN kopyala-yapıştır.
- ⬜ Uygulama ikonu: `assets/images/icon.png` (512×512 dışa aktar).
- ⬜ Feature graphic: `store-assets/feature-graphic.png` (1024×500).
- ⬜ Ekran görüntüleri: `store-assets/screenshots/` içinde başlangıç seti var
  (canlı çekildi). **Temiz bir release build'de birkaç echo ekleyip yeniden
  çek** (harita/timeline boş görünmesin), TR+EN setleri hazırla. Min 2, ideal 4-8.

## 12. Kapalı test → Production [⬜ SEN]
- ⬜ Yeni kişisel hesaplarda Play, production öncesi **kapalı test** isteyebilir:
  **12+ test kullanıcısı, 14 gün**. Sıra: Internal test → Closed test → Production.
- ⬜ Test kullanıcıları için e-posta listesi oluştur, daveti gönder.
- ⬜ 14 gün sonra Production'a yükselt.

## 13. Hesap & veri silme [⬜ SEN — sadece Supabase açtıysan]
- Bulut yedek **kapalıysa** gerekmez (her şey cihazda, uninstall siler).
- Bulut **açtıysan**: uygulama içi hesap silme + bir web/e-posta silme yolu
  sağla (Play zorunlu kılar).

---

## Özet — minimum yayın yolu (Supabase'siz)
1. Play Console hesabı aç ($25) → Madde 5
2. Gizlilik politikasını yayınla → Madde 6
3. `eas build ... production` ile AAB üret → Madde 7
4. Play'de uygulama oluştur, AAB yükle → Madde 8
5. Data Safety + content rating + listing doldur → Madde 9-11
6. Kapalı test (12 kişi/14 gün) → Production → Madde 12

## Geliştirmeye devam (kod tarafı, sende kalan opsiyoneller)
- Settings ekranı UI (tema/dil değiştirici) — altyapı hazır, ekran eklenebilir.
- Supabase sync motorunun pull/merge tarafı (scaffold hazır).
- Mapbox Studio'da bespoke "slate" stil (şu an dark-v11 tabanı).
- Globe'a kıta dokusu (land-mask) — `components/globe/shaders/earth.ts`.

Her şey çalışır durumda. Takıldığın maddede söyle, birlikte hallederiz.

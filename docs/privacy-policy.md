# Privacy Policy — Echo Map

**Last updated: 10 June 2026**

Echo Map ("the app", "we") lets you record short ambient sounds, tag them to the
place they happened, and listen to them again later. This policy explains what
data the app handles and how. Echo Map is **local-first**: by default everything
stays on your device and no account is required.

> Replace the contact email and hosting URL below before publishing.
> Contact: **echomap.privacy@example.com**

## Summary

- Your recordings and their locations are stored **on your device**.
- We do **not** sell or share your personal data with third parties for
  advertising.
- Location is used **only while you are recording**, never in the background.
- Cloud backup is **optional and off by default**. It only happens if you
  explicitly turn it on.

## Information we handle

### 1. Audio recordings
When you choose to record, the app captures audio through your device's
microphone and saves it as a file on your device. Recordings are created only
when you actively start one. They are stored in the app's private storage.

### 2. Location
When you save a recording, the app reads your **current location** (foreground
only) to tag the recording so you can find it on the map. The app may convert
those coordinates into a place name using your device's built-in geocoder.
Location is requested only at the moment of saving and is **never accessed in the
background**.

### 3. Account information (optional cloud backup only)
If — and only if — you enable optional cloud backup, you create an account using
an email address (or a supported sign-in provider). We then store your account
identifier together with your synced recordings.

## How your information is used

- To create, store, play back, and organize your recordings on your device.
- To place your recordings on the map and label them with a location.
- If you enable cloud backup: to back up your recordings and sync them across
  your devices.

We do not use your data for advertising or profiling.

## Storage and processing

- **On device (default):** recording files, waveform data, and metadata
  (title, note, coordinates, date) are stored in the app's private storage.
- **Map rendering:** to draw the map, the app sends map tile requests to
  **Mapbox**, our map provider. These requests include the map area you are
  viewing. See Mapbox's privacy policy for details.
- **Cloud backup (optional):** if enabled, recordings and metadata are sent over
  an encrypted connection (HTTPS/TLS) to our backup provider (**Supabase**) and
  stored in your private, access-controlled space. Other users cannot access
  your data.

## Sharing

We do not sell your personal data. We do not share it with third parties except:
- service providers that operate the app's features on our behalf (e.g. the map
  provider and, if you enable it, the cloud backup provider); and
- where required by law.

When you use the in-app **Share** feature, you choose who to share a recording
with through your device's share sheet.

## Data retention and deletion

- You can delete any recording in the app at any time; this removes the audio
  file and its metadata from your device.
- **Uninstalling** the app removes all locally stored recordings and settings.
- You can export your recordings at any time from Settings.
- If you enabled cloud backup, you can **delete your account and all associated
  cloud data** from within the app (Settings → account), which permanently
  removes your synced recordings from our backup provider. You may also request
  deletion by emailing the contact address above.

## Permissions

- **Microphone** — to record audio you choose to capture.
- **Location (foreground only)** — to tag recordings with where they happened.
  The app does not request background location.

You can revoke these permissions at any time in your device settings; some
features will stop working without them.

## Children

Echo Map is not directed to children under 13 and we do not knowingly collect
data from them.

## Security

We use reasonable measures to protect your data, including keeping recordings in
the app's private storage and using encrypted connections for optional cloud
backup. No method of storage or transmission is completely secure.

## Changes to this policy

We may update this policy. Material changes will be reflected by updating the
"Last updated" date above.

## Contact

Questions about this policy: **echomap.privacy@example.com**

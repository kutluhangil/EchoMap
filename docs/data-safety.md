# Google Play Data Safety — Echo Map

A mapping to help fill the **Data safety** form in Play Console. Verify against
the current Play requirements before submitting; policies change.

## Overview answers

- **Does your app collect or share any required user data?** Yes (it collects;
  it does not share for advertising). Most data stays on-device, but the form
  generally treats data the app accesses as "collected".
- **Is all data encrypted in transit?** Yes (optional cloud backup uses HTTPS/TLS;
  map requests use HTTPS).
- **Do you provide a way to request data deletion?** Yes — in-app deletion of
  recordings; account & data deletion when cloud backup is enabled; plus a
  contact email.

## Data types

| Data type | Collected | Shared | Purpose | Optional? |
|---|---|---|---|---|
| **Audio (voice/sound recordings)** | Yes | No | App functionality (the core feature) | Required to use the app |
| **Approximate/precise location** | Yes | No | App functionality (geotag recordings) | Required to save a recording; foreground only |
| **Email address** | Only if cloud backup enabled | No | Account management | Optional |
| **App activity / other** | No | No | — | — |

> The map provider (Mapbox) receives map-tile requests to render the map. The
> backup provider (Supabase) receives recordings/metadata only if the user
> enables cloud backup. Declare these processors as required by the form.

## Security practices

- Data is encrypted in transit (TLS).
- Users can request that data be deleted (in-app + email).
- Recordings are stored in the app's private storage on device by default.

## Permissions declared (Android)

- `RECORD_AUDIO`
- `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` (foreground only)
- **No** background location, **no** `ACCESS_BACKGROUND_LOCATION`.

## Prominent disclosure

The onboarding flow shows an in-context disclosure before requesting microphone
and location access, explaining what each is used for and that data stays on the
device — satisfying Play's prominent-disclosure requirement for sensitive
permissions.

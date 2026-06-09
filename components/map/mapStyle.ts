import { palette } from '@/theme/colors';

/** Public Mapbox access token (pk...). Empty until the user configures .env. */
export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
export const isMapConfigured = MAPBOX_TOKEN.length > 0;

/**
 * Base map style. Mapbox's dark style reads as the cool, desaturated "slate
 * world" of the design thesis. A bespoke slate style can be built in Mapbox
 * Studio and swapped in here without touching the map components.
 */
export const MAP_STYLE_URL = 'mapbox://styles/mapbox/dark-v11';

export const DEFAULT_ZOOM = 11;
// Mapbox uses [longitude, latitude].
export const DEFAULT_CENTER: [number, number] = [35, 39];

/**
 * Ember pin styling. Each echo is drawn as a soft halo plus a solid dot — the
 * sound-ring motif at map scale. Kept here so the layers stay declarative.
 */
export const pinStyle = {
  haloColor: palette.ember,
  haloOpacity: 0.18,
  haloRadius: 18,
  dotColor: palette.ember,
  dotRadius: 6,
  dotStroke: palette.ink,
};

export const clusterStyle = {
  color: palette.ember,
  textColor: palette.ink,
  strokeColor: palette.ink,
};

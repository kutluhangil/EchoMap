/**
 * Generates Echo Map's brand assets from the sound-ring motif: app icon,
 * adaptive foreground + monochrome, splash logo, favicon, and the Play feature
 * graphic. Run with `node scripts/generate-assets.js`. Re-run after tweaking
 * the palette or rings.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INK = '#171A1F';
const EMBER = '#E08A3C';
const MIST = '#E9EBE8';
const FOG = '#9AA3AD';

function ring(r, opacity, width) {
  return `<circle r="${r}" stroke-opacity="${opacity}" stroke-width="${width}"/>`;
}

// Full app icon: ember sound rings radiating from a core, on the cool ink ground.
function iconSvg() {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${INK}"/>
  <g transform="translate(512,512)" fill="none" stroke="${EMBER}" stroke-linecap="round">
    ${ring(360, 0.1, 10)}${ring(270, 0.22, 12)}${ring(180, 0.45, 14)}${ring(96, 0.85, 16)}
  </g>
  <circle cx="512" cy="512" r="40" fill="${EMBER}"/>
</svg>`;
}

// Rings only (transparent), kept inside the adaptive-icon safe zone.
function ringsSvg(stroke) {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(512,512)" fill="none" stroke="${stroke}" stroke-linecap="round">
    <circle r="280" stroke-opacity="0.14" stroke-width="10"/>
    <circle r="210" stroke-opacity="0.30" stroke-width="12"/>
    <circle r="140" stroke-opacity="0.55" stroke-width="14"/>
    <circle r="74" stroke-opacity="0.9" stroke-width="16"/>
  </g>
  <circle cx="512" cy="512" r="34" fill="${stroke}"/>
</svg>`;
}

function solidSvg(color) {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="${color}"/></svg>`;
}

function featureSvg() {
  return `<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="500" fill="${INK}"/>
  <g transform="translate(250,250)" fill="none" stroke="${EMBER}" stroke-linecap="round">
    <circle r="180" stroke-opacity="0.12" stroke-width="6"/>
    <circle r="130" stroke-opacity="0.28" stroke-width="8"/>
    <circle r="80" stroke-opacity="0.55" stroke-width="10"/>
  </g>
  <circle cx="250" cy="250" r="22" fill="${EMBER}"/>
  <text x="470" y="238" font-family="sans-serif" font-size="76" font-weight="700" fill="${MIST}">Echo Map</text>
  <text x="473" y="292" font-family="sans-serif" font-size="30" fill="${FOG}">A sound map of your life</text>
</svg>`;
}

async function render(svg, out, width, height) {
  await sharp(Buffer.from(svg))
    .resize(width, height ?? width)
    .png()
    .toFile(out);
  // eslint-disable-next-line no-console
  console.log('wrote', path.relative(process.cwd(), out));
}

(async () => {
  const images = path.join(__dirname, '..', 'assets', 'images');
  const store = path.join(__dirname, '..', 'store-assets');
  fs.mkdirSync(store, { recursive: true });

  await render(iconSvg(), path.join(images, 'icon.png'), 1024);
  await render(ringsSvg(EMBER), path.join(images, 'android-icon-foreground.png'), 1024);
  await render(ringsSvg('#FFFFFF'), path.join(images, 'android-icon-monochrome.png'), 1024);
  await render(solidSvg(INK), path.join(images, 'android-icon-background.png'), 1024);
  await render(ringsSvg(EMBER), path.join(images, 'splash-icon.png'), 1024);
  await render(iconSvg(), path.join(images, 'favicon.png'), 64);
  await render(featureSvg(), path.join(store, 'feature-graphic.png'), 1024, 500);
})();

/**
 * Audio level helpers shared by the recorder and player. Metering arrives as
 * dBFS (roughly -60..0); the UI wants a normalized 0..1 amplitude for the sound
 * rings and waveform bars.
 */

const DB_FLOOR = -60;

/** Map metering (dBFS) to a 0..1 amplitude; silence and invalid values read 0. */
export function meteringToAmplitude(metering: number | undefined): number {
  if (metering === undefined || !Number.isFinite(metering)) return 0;
  const clamped = Math.max(DB_FLOOR, Math.min(0, metering));
  return (clamped - DB_FLOOR) / -DB_FLOOR;
}

/**
 * Collects amplitude readings during a recording and downsamples them to a
 * fixed number of bars for a compact, persistable waveform.
 */
export class WaveformSampler {
  private readonly samples: number[] = [];

  push(amplitude: number): void {
    this.samples.push(amplitude);
  }

  toBars(barCount = 48): number[] {
    if (this.samples.length === 0) return new Array<number>(barCount).fill(0);
    const bars: number[] = [];
    const bucketSize = this.samples.length / barCount;
    for (let i = 0; i < barCount; i += 1) {
      const start = Math.floor(i * bucketSize);
      const end = Math.max(start + 1, Math.floor((i + 1) * bucketSize));
      const bucket = this.samples.slice(start, end);
      const average = bucket.reduce((sum, value) => sum + value, 0) / bucket.length;
      bars.push(Number.isFinite(average) ? Number(average.toFixed(3)) : 0);
    }
    return bars;
  }
}

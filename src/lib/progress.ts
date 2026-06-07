/**
 * Compute the percentage of a video watched, as a rounded integer 0..100.
 * Returns 0 if durationSeconds <= 0 or positionSeconds < 0.
 */
export function computeWatched(
  positionSeconds: number,
  durationSeconds: number
): number {
  if (durationSeconds <= 0 || positionSeconds < 0) return 0;
  const raw = (positionSeconds / durationSeconds) * 100;
  return Math.min(Math.round(raw), 100);
}

/**
 * Returns true when the watch percentage reaches the completion threshold (90%).
 */
export function isComplete(percent: number): boolean {
  return percent >= 90;
}

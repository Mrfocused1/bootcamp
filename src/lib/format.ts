/**
 * Formats a duration in seconds to "m:ss" notation.
 * Examples: 0 → "0:00", 65 → "1:05", 600 → "10:00"
 */
export function formatTimestamp(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

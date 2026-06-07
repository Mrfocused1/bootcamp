const MAX_DAYS = 5;

/** Parse an ISO date string ('YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ssZ') as UTC midnight. */
function parseUTC(date: string): number {
  const datePart = date.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) throw new Error(`Invalid date string: ${date}`);
  return Date.UTC(year, month - 1, day);
}

/**
 * Returns the highest day number (1-based) unlocked for a learner.
 * Day 1 unlocks on startDate, Day 2 on startDate+1, etc.
 * Clamped to 0..MAX_DAYS (5).
 */
export function maxUnlockedDay(startDate: string, today: string): number {
  const startMs = parseUTC(startDate);
  const todayMs = parseUTC(today);
  const diffDays = Math.floor((todayMs - startMs) / (1000 * 60 * 60 * 24));
  const day = diffDays + 1; // day 1 = 0 days after start
  return Math.min(Math.max(day, 0), MAX_DAYS);
}

/**
 * Returns true if `dayIndex` (1-based) is unlocked.
 */
export function isDayUnlocked(
  dayIndex: number,
  startDate: string,
  today: string
): boolean {
  if (dayIndex < 1) return false;
  return dayIndex <= maxUnlockedDay(startDate, today);
}

/**
 * Returns the ISO 'YYYY-MM-DD' date on which `dayIndex` unlocks
 * (startDate + (dayIndex - 1) days).
 */
export function unlockDate(dayIndex: number, startDate: string): string {
  const startMs = parseUTC(startDate);
  const unlockMs = startMs + (dayIndex - 1) * 24 * 60 * 60 * 1000;
  const d = new Date(unlockMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

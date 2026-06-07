/**
 * Pure calendar helpers — all date math uses UTC, all strings are 'YYYY-MM-DD'.
 */

/** Parse a 'YYYY-MM-DD' string as UTC midnight → timestamp in ms. */
function parseUTC(dateISO: string): number {
  const [year, month, day] = dateISO.slice(0, 10).split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Format a UTC timestamp as 'YYYY-MM-DD'. */
function formatUTC(ms: number): string {
  const d = new Date(ms);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the ISO date string `n` days after `dateISO`.
 * Works across month and year boundaries.
 */
export function addDaysISO(dateISO: string, n: number): string {
  const ms = parseUTC(dateISO) + n * 24 * 60 * 60 * 1000;
  return formatUTC(ms);
}

/**
 * Returns a grid of weeks for the given calendar month.
 * Each row is an array of 7 items: ISO date strings for days in the month,
 * or `null` for padding days outside the month.
 * Weeks start on Monday (ISO week convention).
 */
export function monthGrid(year: number, month1to12: number): (string | null)[][] {
  // First day of the month
  const firstMs = Date.UTC(year, month1to12 - 1, 1);
  const firstDay = new Date(firstMs);

  // JS: 0=Sun, 1=Mon … 6=Sat → convert to Mon=0 … Sun=6
  const firstDow = (firstDay.getUTCDay() + 6) % 7;

  // Number of days in the month
  const daysInMonth = new Date(Date.UTC(year, month1to12, 0)).getUTCDate();

  const cells: (string | null)[] = [];

  // Leading nulls
  for (let i = 0; i < firstDow; i++) cells.push(null);

  // Month days
  for (let d = 1; d <= daysInMonth; d++) {
    const ms = Date.UTC(year, month1to12 - 1, d);
    cells.push(formatUTC(ms));
  }

  // Trailing nulls to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  // Split into weeks
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Returns true if `dateISO` is strictly before `todayISO`.
 */
export function isPastISO(dateISO: string, todayISO: string): boolean {
  return dateISO < todayISO;
}

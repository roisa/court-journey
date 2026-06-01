/** Date / time helpers. Kept dependency-free. */

export function nowIso(): string {
  return new Date().toISOString();
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "12 May 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Human relative label: "Today", "Yesterday", "3 days ago", else a date. */
export function relativeDay(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(then)) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'Last week';
  return formatDate(iso);
}

export function timeOfDay(iso: string): 'morning' | 'afternoon' | 'evening' {
  const h = new Date(iso).getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

/** Whole years elapsed since `iso` (0 if under a year). */
export function yearsSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (365.25 * 86_400_000));
}

/** True if `iso` falls on the same month+day as today (any prior year). */
export function isAnniversaryToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate() &&
    d.getFullYear() < now.getFullYear()
  );
}

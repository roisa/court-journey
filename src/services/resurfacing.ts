/**
 * Memory resurfacing — "On This Day" (docs/10, magic moment #1).
 * The cheapest, highest-emotion retention hook. Picks one memory worth
 * reliving today, preferring true anniversaries.
 */
import type { AppState, Memory } from '@/types/models';
import { isAnniversaryToday, yearsSince } from '@/lib/date';

export interface Resurfaced {
  memory: Memory;
  label: string; // e.g. "One year ago today"
}

export function pickResurfaced(state: AppState): Resurfaced | null {
  const candidates = state.memories.filter((m) => m.aiTitle || m.rawNote);

  // 1) True anniversary (same month/day, a prior year).
  const anniversary = candidates.find((m) => isAnniversaryToday(m.occurredAt));
  if (anniversary) {
    const yrs = Math.max(1, yearsSince(anniversary.occurredAt));
    return {
      memory: anniversary,
      label: yrs === 1 ? 'One year ago today' : `${yrs} years ago today`,
    };
  }

  // 2) Roughly one month ago (±3 days).
  const now = Date.now();
  const monthAgo = candidates.find((m) => {
    const days = (now - new Date(m.occurredAt).getTime()) / 86_400_000;
    return days >= 27 && days <= 33;
  });
  if (monthAgo) return { memory: monthAgo, label: 'One month ago' };

  return null;
}

import type { ChecklistItem, ChecklistType, ExperienceTier } from '@/types/models';
import { uid } from '@/lib/id';

interface PresetItem {
  text: string;
  why?: string;
}

/**
 * Adaptive preset checklists (docs/07-preparation-system.md).
 * The list shrinks and changes tone as the player gains experience.
 */
const FIRST: PresetItem[] = [
  { text: 'Pack two rackets', why: 'A string can break — don’t let it end your day.' },
  { text: 'Water + a snack', why: 'Matches run long. Energy = focus.' },
  { text: 'Eat about 2 hours before', why: 'Not too close to match time.' },
  { text: 'Sunscreen / hat / spare shirt', why: 'Comfort = confidence.' },
  { text: 'Arrive 30–45 min early', why: 'Rushing kills your nerves.' },
  { text: 'Know the format', why: 'Best of 3? Tiebreak? Ask if unsure — everyone does.' },
  { text: 'Reframe the nerves', why: 'Everyone here is nervous. Goal #1: have fun and finish.' },
  { text: 'Take one photo', why: 'You’ll want to remember your first one.' },
  { text: 'Pick ONE thing to focus on', why: 'e.g. “watch the ball.” Simplicity wins.' },
];

const REGULAR: PresetItem[] = [
  { text: 'Gear check', why: 'Rackets, grips, shoes, kit.' },
  { text: 'Hydration & nutrition plan', why: 'Know your fuel before, during, after.' },
  { text: 'Arrival time set', why: 'What warm-up window felt best last time?' },
  { text: 'One tactical intention', why: 'A single sentence — not an essay.' },
];

const HIGH_EXTRA: PresetItem[] = [
  { text: 'Two nights of good sleep', why: 'Matters more than one perfect night.' },
  { text: 'Your proven pre-match routine', why: 'Do what worked in your best results.' },
  { text: 'Mental routine for pressure', why: 'Point-by-point. Breathe between points.' },
  { text: 'One game-plan sentence', why: 'Keep it simple under pressure.' },
];

function toItems(presets: PresetItem[]): ChecklistItem[] {
  return presets.map((p) => ({
    id: uid('ci_'),
    text: p.text,
    why: p.why,
    isChecked: false,
  }));
}

export interface ChecklistPreset {
  type: ChecklistType;
  name: string;
  items: ChecklistItem[];
}

/**
 * Choose the right preset given the player's experience tier and the stakes of
 * this specific tournament.
 */
export function buildPreset(
  tier: ExperienceTier,
  stakes: 'casual' | 'regular' | 'high',
): ChecklistPreset {
  if (tier === 'beginner') {
    return { type: 'first', name: 'Your first tournament', items: toItems(FIRST) };
  }
  if (stakes === 'high') {
    return {
      type: 'high',
      name: 'High-stakes prep',
      items: toItems([...REGULAR, ...HIGH_EXTRA]),
    };
  }
  return { type: 'regular', name: 'Tournament prep', items: toItems(REGULAR) };
}

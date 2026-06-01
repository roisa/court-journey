import type { LessonPolarity } from '@/types/models';

/**
 * Quick reflection chips (docs/06). Each maps to a normalized `theme` and a
 * polarity so the Improvement Engine can aggregate them (docs/08) without the
 * user ever entering a statistic.
 */
export interface ReflectionChip {
  label: string;
  theme: string;
  polarity: LessonPolarity;
}

export const REFLECTION_CHIPS: ReflectionChip[] = [
  { label: 'My forehand felt great', theme: 'forehand', polarity: 'strength' },
  { label: 'My serve was on', theme: 'serve', polarity: 'strength' },
  { label: 'Stayed calm on big points', theme: 'composure', polarity: 'strength' },
  { label: 'Great comeback', theme: 'resilience', polarity: 'strength' },
  { label: 'Tactics worked', theme: 'tactics', polarity: 'strength' },
  { label: 'Net play clicked', theme: 'net_play', polarity: 'strength' },
  { label: 'Got tight on big points', theme: 'tightness', polarity: 'weakness' },
  { label: 'Rushed my shots', theme: 'rushing', polarity: 'weakness' },
  { label: 'Footwork let me down', theme: 'footwork', polarity: 'weakness' },
  { label: 'Second serve wobbled', theme: 'second_serve', polarity: 'weakness' },
  { label: 'Lost focus', theme: 'focus', polarity: 'weakness' },
  { label: 'Started slow', theme: 'slow_start', polarity: 'weakness' },
];

export function chipByLabel(label: string): ReflectionChip | undefined {
  return REFLECTION_CHIPS.find((c) => c.label === label);
}

/** Human-friendly name for a normalized theme (used in insights / Learn). */
export function themeLabel(theme: string): string {
  return theme.replace(/_/g, ' ');
}

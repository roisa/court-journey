import type { Feeling } from '@/types/models';

export interface FeelingOption {
  value: Feeling;
  emoji: string;
  label: string;
}

/** The emotional pulse scale (docs/06-reflection-flow.md), low → high. */
export const FEELINGS: FeelingOption[] = [
  { value: 'frustrated', emoji: '😤', label: 'frustrated' },
  { value: 'flat', emoji: '😕', label: 'flat' },
  { value: 'okay', emoji: '😐', label: 'okay' },
  { value: 'good', emoji: '🙂', label: 'good' },
  { value: 'onfire', emoji: '🤩', label: 'on fire' },
];

export function feelingOption(f?: Feeling): FeelingOption | undefined {
  return FEELINGS.find((x) => x.value === f);
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '@/types/models';

/**
 * Local-first persistence (docs/13 — "offline-first capture is non-negotiable").
 * The entire app state is stored under one key. This is the seam where a
 * Supabase-backed sync layer would later plug in.
 */
const KEY = 'court-journey/state/v1';

export const emptyState: AppState = {
  user: null,
  tournaments: [],
  matches: [],
  memories: [],
  photos: [],
  voiceNotes: [],
  lessons: [],
  insights: [],
  checklists: [],
  unlocked: [],
  resurfacedLog: {},
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Merge over emptyState so new fields added later don't crash old saves.
    return { ...emptyState, ...parsed };
  } catch {
    return emptyState;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Best-effort; the in-memory state remains the source of truth this session.
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Cloud sync (docs/13). Stores the whole journey as one JSON row per user in
 * Supabase, protected by Row-Level Security. Last-write-wins by `_updatedAt`.
 *
 * Note: photos/voice notes are device-local file URIs and are NOT uploaded yet
 * — the structured journey (matches, memories, lessons, achievements…) syncs.
 * Media upload via Supabase Storage is a future addition.
 */
import { supabase } from './supabase';
import type { AppState } from '@/types/models';

const TABLE = 'journeys';

type RemotePayload = AppState & { _updatedAt?: number };

export interface RemoteJourney {
  state: AppState;
  updatedAt: number;
}

export async function pullRemote(userId: string): Promise<RemoteJourney | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data?.data) return null;
  const { _updatedAt, ...state } = data.data as RemotePayload;
  return { state: state as AppState, updatedAt: _updatedAt ?? 0 };
}

export async function pushRemote(
  userId: string,
  state: AppState,
  updatedAt: number,
): Promise<boolean> {
  if (!supabase) return false;
  const payload: RemotePayload = { ...state, _updatedAt: updatedAt };
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, data: payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  return !error;
}

/**
 * Media sync via Supabase Storage (free tier). Best-effort: every function is
 * a no-op when unconfigured and swallows errors so the on-device file always
 * remains the source of truth. Uploads to a private `media` bucket; reads use
 * short-lived signed URLs.
 */
import { supabase } from './supabase';

const BUCKET = 'media';

/** Upload a local file (photo/voice) and return its storage path, or null. */
export async function uploadMedia(
  userId: string,
  localUri: string,
  fileId: string,
  contentType: string,
): Promise<string | null> {
  if (!supabase) return null;
  try {
    const res = await fetch(localUri);
    const blob = await res.blob();
    const path = `${userId}/${fileId}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType, upsert: true });
    return error ? null : path;
  } catch {
    return null;
  }
}

const signedCache = new Map<string, { url: string; expires: number }>();

/** A signed, time-limited URL for a stored object (cached until near expiry). */
export async function getSignedUrl(path: string, expiresSec = 3600): Promise<string | null> {
  if (!supabase) return null;
  const cached = signedCache.get(path);
  if (cached && cached.expires > Date.now() + 60_000) return cached.url;
  try {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresSec);
    if (error || !data?.signedUrl) return null;
    signedCache.set(path, { url: data.signedUrl, expires: Date.now() + expiresSec * 1000 });
    return data.signedUrl;
  } catch {
    return null;
  }
}

export function guessContentType(uri: string, fallback: string): string {
  const m = uri.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|m4a|mp3|wav|caf|aac)(?:\?|$)/);
  const ext = m?.[1];
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    caf: 'audio/x-caf',
  };
  return ext ? (map[ext] ?? fallback) : fallback;
}

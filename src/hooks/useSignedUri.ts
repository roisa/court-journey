import { useEffect, useState } from 'react';
import { getSignedUrl } from '@/services/media';

/**
 * Resolves a Supabase Storage `remotePath` to a short-lived signed URL.
 * Returns null until ready (or if there's no path / no cloud configured).
 */
export function useSignedUri(remotePath?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!remotePath) {
      setUrl(null);
      return;
    }
    getSignedUrl(remotePath).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [remotePath]);
  return url;
}

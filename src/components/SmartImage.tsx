import React, { useEffect, useState } from 'react';
import { Image, type ImageProps, type ImageStyle, type StyleProp } from 'react-native';
import { getSignedUrl } from '@/services/media';

/**
 * Image that prefers the on-device file (instant, offline) and silently falls
 * back to the cloud copy via a signed URL when the local file can't load —
 * e.g. when viewing on a different device after sync.
 */
export function SmartImage({
  uri,
  remotePath,
  style,
  resizeMode = 'cover',
}: {
  uri?: string;
  remotePath?: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageProps['resizeMode'];
}) {
  const [src, setSrc] = useState<string | undefined>(uri);
  const [triedRemote, setTriedRemote] = useState(false);

  useEffect(() => {
    setSrc(uri);
    setTriedRemote(false);
  }, [uri]);

  // No usable local file but we have a cloud copy → resolve it now.
  useEffect(() => {
    let active = true;
    if (!uri && remotePath) {
      getSignedUrl(remotePath).then((u) => {
        if (active && u) setSrc(u);
      });
    }
    return () => {
      active = false;
    };
  }, [uri, remotePath]);

  async function handleError() {
    if (remotePath && !triedRemote) {
      setTriedRemote(true);
      const u = await getSignedUrl(remotePath);
      if (u) setSrc(u);
    }
  }

  if (!src) return <Image source={{ uri: undefined }} style={style} />;
  return <Image source={{ uri: src }} style={style} resizeMode={resizeMode} onError={handleError} />;
}

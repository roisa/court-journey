import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radii, spacing } from '@/theme';
import { Txt } from './ui';

/** Attach photos to a memory (docs/05 — the strongest nostalgia trigger). */
export function PhotoPicker({
  uris,
  onChange,
}: {
  uris: string[];
  onChange: (uris: string[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function add() {
    try {
      setError(null);
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsMultipleSelection: true,
        selectionLimit: 4,
      });
      if (!res.canceled) {
        const picked = res.assets.map((a) => a.uri);
        onChange([...uris, ...picked].slice(0, 4));
      }
    } catch {
      setError('Couldn’t open your photos.');
    }
  }

  function remove(uri: string) {
    onChange(uris.filter((u) => u !== uri));
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {uris.map((u) => (
          <Pressable key={u} onLongPress={() => remove(u)} style={styles.thumbWrap}>
            <Image source={{ uri: u }} style={styles.thumb} />
            <Pressable onPress={() => remove(u)} style={styles.removeBadge} hitSlop={8}>
              <Txt variant="micro" color={colors.onCourt}>
                ✕
              </Txt>
            </Pressable>
          </Pressable>
        ))}
        {uris.length < 4 && (
          <Pressable onPress={add} style={styles.addBtn}>
            <Txt variant="title" color={colors.court}>
              +
            </Txt>
            <Txt variant="caption" color={colors.inkSoft}>
              Photo
            </Txt>
          </Pressable>
        )}
      </ScrollView>
      {error && (
        <Txt variant="caption" color={colors.loss} style={{ marginTop: spacing.xs }}>
          {error}
        </Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thumbWrap: { position: 'relative' },
  thumb: { width: 92, height: 92, borderRadius: radii.md, backgroundColor: colors.surfaceAlt },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.courtDark,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 92,
    height: 92,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.court,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});

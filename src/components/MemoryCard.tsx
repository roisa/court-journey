import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { Memory } from '@/types/models';
import { useApp } from '@/store/AppStore';
import { feelingOption } from '@/data/feelings';
import { relativeDay } from '@/lib/date';
import { colors, radii, spacing } from '@/theme';
import { Card, Row, Txt } from './ui';

const RESULT_LABEL: Record<string, { text: string; color: string }> = {
  won: { text: 'WON', color: colors.win },
  lost: { text: 'LOST', color: colors.loss },
  played: { text: 'PLAYED', color: colors.neutralPlay },
};

export function MemoryCard({ memory, onPress }: { memory: Memory; onPress: () => void }) {
  const { state } = useApp();
  const match = memory.matchId ? state.matches.find((m) => m.id === memory.matchId) : undefined;
  const photo = memory.photoIds.length
    ? state.photos.find((p) => p.id === memory.photoIds[0])
    : undefined;
  const feeling = feelingOption(memory.feeling);
  const result = match ? RESULT_LABEL[match.result] : undefined;

  return (
    <Card onPress={onPress} style={styles.card}>
      {photo && <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />}
      <View style={styles.body}>
        <Row gap={spacing.sm} style={{ marginBottom: spacing.xs }}>
          {result && (
            <Txt variant="micro" color={result.color}>
              {result.text}
            </Txt>
          )}
          {match?.opponentName ? (
            <Txt variant="micro" color={colors.inkFaint}>
              vs {match.opponentName.toUpperCase()}
            </Txt>
          ) : null}
          <View style={{ flex: 1 }} />
          {feeling && <Txt variant="body">{feeling.emoji}</Txt>}
        </Row>

        <Txt variant="heading" numberOfLines={2}>
          {memory.aiTitle ?? 'A match'}
        </Txt>

        {memory.aiStory ? (
          <Txt variant="body" color={colors.inkSoft} numberOfLines={2} style={{ marginTop: spacing.xs }}>
            {memory.aiStory.replace(/\n+/g, ' ')}
          </Txt>
        ) : null}

        <Row gap={spacing.md} style={{ marginTop: spacing.md }}>
          <Txt variant="caption" color={colors.inkFaint}>
            {relativeDay(memory.occurredAt)}
          </Txt>
          {memory.voiceNoteIds.length > 0 && (
            <Txt variant="caption" color={colors.inkFaint}>
              🎙 voice
            </Txt>
          )}
          {match?.score ? (
            <Txt variant="caption" color={colors.inkFaint}>
              {match.score}
            </Txt>
          ) : null}
        </Row>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  photo: { width: '100%', height: 170, backgroundColor: colors.surfaceAlt },
  body: { padding: spacing.lg },
});

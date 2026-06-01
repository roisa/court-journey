import React from 'react';
import { StyleSheet } from 'react-native';
import type { Resurfaced } from '@/services/resurfacing';
import { colors, spacing } from '@/theme';
import { Card, Row, Txt } from './ui';

/** "On This Day" resurfacing card (docs/10 #1). */
export function ResurfaceCard({ item, onPress }: { item: Resurfaced; onPress: () => void }) {
  return (
    <Card tone="court" onPress={onPress} style={styles.card}>
      <Row gap={spacing.sm}>
        <Txt variant="body">✨</Txt>
        <Txt variant="micro" color={colors.onCourtSoft}>
          {item.label.toUpperCase()}
        </Txt>
      </Row>
      <Txt variant="heading" color={colors.onCourt} style={{ marginTop: spacing.sm }}>
        {item.memory.aiTitle ?? 'A memory worth reliving'}
      </Txt>
      <Txt variant="caption" color={colors.onCourtSoft} style={{ marginTop: spacing.xs }}>
        Tap to take yourself back →
      </Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
});

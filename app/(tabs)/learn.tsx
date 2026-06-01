import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useApp } from '@/store/AppStore';
import { deriveInsights } from '@/services/insights';
import { themeLabel } from '@/data/tags';
import { Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import type { Insight } from '@/types/models';

const TYPE_META: Record<Insight['type'], { label: string; color: string; emoji: string }> = {
  strength: { label: 'Your weapon', color: colors.win, emoji: '💪' },
  weakness: { label: 'Next to train', color: colors.clay, emoji: '🎯' },
  mental: { label: 'Mental pattern', color: colors.court, emoji: '🧠' },
  situational: { label: 'Tendency', color: colors.court, emoji: '🔍' },
  rivalry: { label: 'Rivalry', color: colors.court, emoji: '🤝' },
  routine: { label: 'Routine', color: colors.court, emoji: '🔁' },
};

export default function Learn() {
  const { state } = useApp();
  const insights = useMemo(() => deriveInsights(state), [state]);

  // The lesson library — every saved lesson, grouped by theme.
  const lessonThemes = useMemo(() => {
    const map: Record<string, { polarity: string; count: number }> = {};
    for (const l of state.lessons) {
      if (l.polarity === 'neutral') continue;
      const e = (map[l.theme] ??= { polarity: l.polarity, count: 0 });
      e.count++;
    }
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [state.lessons]);

  return (
    <Screen>
      <View style={{ height: spacing.lg }} />
      <Txt variant="display">Your patterns</Txt>

      {insights.length === 0 ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Txt variant="heading">A few more matches 🌱</Txt>
          <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
            Your patterns show up here — no charts, just insight.
          </Txt>
        </Card>
      ) : (
        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {insights.map((ins) => {
            const meta = TYPE_META[ins.type];
            return (
              <Card key={ins.id} style={{ borderLeftWidth: 4, borderLeftColor: meta.color }}>
                <Row gap={spacing.sm}>
                  <Txt variant="body">{meta.emoji}</Txt>
                  <Txt variant="micro" color={meta.color}>
                    {meta.label.toUpperCase()}
                  </Txt>
                </Row>
                <Txt variant="prose" style={{ marginTop: spacing.sm }}>
                  {ins.narrative}
                </Txt>
              </Card>
            );
          })}
        </View>
      )}

      {lessonThemes.length > 0 && (
        <>
          <SectionTitle>Your lessons, by theme</SectionTitle>
          <View style={{ gap: spacing.sm }}>
            {lessonThemes.map(([theme, info]) => (
              <Row key={theme} style={styles_themeRow}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: info.polarity === 'strength' ? colors.win : colors.clay,
                  }}
                />
                <Txt variant="bodyStrong" style={{ flex: 1 }}>
                  {capitalize(themeLabel(theme))}
                </Txt>
                <Txt variant="caption" color={colors.inkFaint}>
                  {info.count}×
                </Txt>
              </Row>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles_themeRow = {
  backgroundColor: colors.surface,
  borderRadius: radii.md,
  padding: spacing.md,
  gap: spacing.md,
} as const;

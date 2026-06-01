import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useApp } from '@/store/AppStore';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  computeStats,
  type Achievement,
} from '@/data/achievements';
import { formatDate } from '@/lib/date';
import { Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

export default function Achievements() {
  const { state } = useApp();
  const stats = useMemo(() => computeStats(state), [state]);
  const unlockedMap = useMemo(
    () => new Map(state.unlocked.map((u) => [u.achievementCode, u])),
    [state.unlocked],
  );

  const earnedCount = state.unlocked.length;

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <Txt variant="title">Your wall</Txt>
      <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
        {earnedCount} earned
      </Txt>

      {ACHIEVEMENT_CATEGORIES.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category);
        if (items.length === 0) return null;
        return (
          <View key={category}>
            <SectionTitle>{category}</SectionTitle>
            <View style={{ gap: spacing.sm }}>
              {items.map((a) => (
                <AchievementRow
                  key={a.code}
                  achievement={a}
                  unlockedAt={unlockedMap.get(a.code)?.unlockedAt}
                  stats={stats}
                />
              ))}
            </View>
          </View>
        );
      })}
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

function AchievementRow({
  achievement,
  unlockedAt,
  stats,
}: {
  achievement: Achievement;
  unlockedAt?: string;
  stats: ReturnType<typeof computeStats>;
}) {
  const earned = !!unlockedAt;
  const progress = achievement.progress?.(stats);

  return (
    <Card style={[styles.row, !earned && styles.locked]}>
      <View style={[styles.medal, earned ? styles.medalOn : styles.medalOff]}>
        <Txt variant="heading">{earned ? '🏅' : '🔒'}</Txt>
      </View>
      <View style={{ flex: 1 }}>
        <Txt variant="bodyStrong" color={earned ? colors.ink : colors.inkSoft}>
          {achievement.title}
        </Txt>
        <Txt variant="caption" color={colors.inkFaint}>
          {achievement.description}
        </Txt>
        {earned ? (
          <Txt variant="micro" color={colors.win} style={{ marginTop: 2 }}>
            EARNED {formatDate(unlockedAt!).toUpperCase()}
          </Txt>
        ) : progress && progress.target > 1 ? (
          <Txt variant="micro" color={colors.clay} style={{ marginTop: 2 }}>
            {Math.min(progress.current, progress.target)} / {progress.target}
          </Txt>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  locked: { opacity: 0.7 },
  medal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalOn: { backgroundColor: colors.surfaceAlt },
  medalOff: { backgroundColor: colors.surfaceAlt },
});

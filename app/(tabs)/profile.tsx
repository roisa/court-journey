import React, { useMemo } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { computeStats } from '@/data/achievements';
import { formatDate } from '@/lib/date';
import { Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

export default function Profile() {
  const { state, reset } = useApp();
  const router = useRouter();
  const stats = useMemo(() => computeStats(state), [state]);

  const user = state.user;
  const sinceLabel = user ? formatDate(user.createdAt) : '';

  // Headline numbers shown as story chips — never a stats grid (docs/11).
  const chips: { value: string; label: string }[] = [
    { value: String(stats.matchCount), label: 'matches' },
    { value: String(state.tournaments.length), label: 'tournaments' },
    { value: String(Math.max(stats.distinctCities, 0)), label: 'cities' },
    { value: String(state.unlocked.length), label: 'badges' },
  ];

  function confirmReset() {
    const doReset = () => void reset();
    if (Platform.OS === 'web') {
      doReset();
      return;
    }
    Alert.alert('Start over?', 'This erases your local journey on this device. This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Erase', style: 'destructive', onPress: doReset },
    ]);
  }

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <Row gap={spacing.md}>
        <View style={styles.avatar}>
          <Txt variant="title" color={colors.onCourt}>
            {(user?.displayName ?? '?').charAt(0).toUpperCase()}
          </Txt>
        </View>
        <View style={{ flex: 1 }}>
          <Txt variant="title">{user?.displayName ?? 'Player'}</Txt>
          <Txt variant="caption" color={colors.inkSoft}>
            {user?.primarySport === 'padel' ? '🟦 Padel' : '🎾 Tennis'}
            {user?.homeVenue ? ` · ${user.homeVenue}` : ''}
          </Txt>
          {sinceLabel ? (
            <Txt variant="caption" color={colors.inkFaint}>
              On court since {sinceLabel}
            </Txt>
          ) : null}
        </View>
      </Row>

      <Row gap={spacing.sm} style={{ marginTop: spacing.lg, flexWrap: 'wrap' }}>
        {chips.map((c) => (
          <View key={c.label} style={styles.statChip}>
            <Txt variant="heading" color={colors.court}>
              {c.value}
            </Txt>
            <Txt variant="caption" color={colors.inkSoft}>
              {c.label}
            </Txt>
          </View>
        ))}
      </Row>

      <SectionTitle>Your story</SectionTitle>
      <Card onPress={() => router.push('/achievements')}>
        <Row>
          <Txt variant="body" style={{ marginRight: spacing.sm }}>
            🏅
          </Txt>
          <Txt variant="bodyStrong" style={{ flex: 1 }}>
            Achievements
          </Txt>
          <Txt variant="body" color={colors.inkFaint}>
            {state.unlocked.length} →
          </Txt>
        </Row>
      </Card>

      <Card onPress={() => router.push('/(tabs)/learn')} style={{ marginTop: spacing.sm }}>
        <Row>
          <Txt variant="body" style={{ marginRight: spacing.sm }}>
            🧠
          </Txt>
          <Txt variant="bodyStrong" style={{ flex: 1 }}>
            Your patterns
          </Txt>
          <Txt variant="body" color={colors.inkFaint}>
            →
          </Txt>
        </Row>
      </Card>

      <SectionTitle>Settings</SectionTitle>
      <Pressable onPress={confirmReset} style={styles.dangerRow}>
        <Txt variant="bodyStrong" color={colors.loss}>
          Start over
        </Txt>
      </Pressable>

      <Txt variant="caption" color={colors.inkFaint} center style={{ marginTop: spacing.xxl }}>
        Court Journey
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.court,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minWidth: 76,
  },
  dangerRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
});

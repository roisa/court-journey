import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { formatDate } from '@/lib/date';
import { Button, Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const RESULT_COLOR: Record<string, string> = {
  won: colors.win,
  lost: colors.loss,
  played: colors.neutralPlay,
};

export default function TournamentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const router = useRouter();

  const tournament = state.tournaments.find((t) => t.id === id);
  const matches = useMemo(
    () =>
      state.matches
        .filter((m) => m.tournamentId === id)
        .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()),
    [state.matches, id],
  );

  if (!tournament) {
    return (
      <Screen>
        <Txt variant="heading" style={{ marginTop: spacing.xl }}>
          Tournament not found.
        </Txt>
      </Screen>
    );
  }

  const wins = matches.filter((m) => m.result === 'won').length;
  const losses = matches.filter((m) => m.result === 'lost').length;

  function memoryForMatch(matchId: string) {
    return state.memories.find((m) => m.matchId === matchId);
  }

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <Card tone="court">
        <Txt variant="micro" color={colors.onCourtSoft}>
          {tournament.stakes.toUpperCase()} · {formatDate(tournament.startDate).toUpperCase()}
        </Txt>
        <Txt variant="title" color={colors.onCourt} style={{ marginTop: spacing.xs }}>
          {tournament.name}
        </Txt>
        {tournament.venue ? (
          <Txt variant="body" color={colors.onCourtSoft} style={{ marginTop: spacing.xs }}>
            📍 {tournament.venue}
            {tournament.city ? `, ${tournament.city}` : ''}
          </Txt>
        ) : null}
        <Txt variant="bodyStrong" color={colors.onCourt} style={{ marginTop: spacing.md }}>
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} · {wins}–{losses}
        </Txt>
      </Card>

      {/* The self-writing chapter */}
      {tournament.chapterSummary ? (
        <>
          <SectionTitle>Your chapter</SectionTitle>
          <Card>
            <Txt variant="prose">{tournament.chapterSummary}</Txt>
          </Card>
        </>
      ) : (
        <Card style={{ marginTop: spacing.lg }}>
          <Txt variant="body" color={colors.inkSoft}>
            Capture your matches and a chapter will write itself here — no summarising required.
          </Txt>
        </Card>
      )}

      {/* Match arc */}
      {matches.length > 0 && (
        <>
          <SectionTitle>How it went</SectionTitle>
          <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
            {matches.map((m, i) => (
              <Pressable
                key={m.id}
                onPress={() => {
                  const mem = memoryForMatch(m.id);
                  if (mem) router.push(`/memory/${mem.id}`);
                }}
                style={[styles.dot, { backgroundColor: RESULT_COLOR[m.result] }]}
              >
                <Txt variant="label" color={colors.onCourt}>
                  {m.result === 'won' ? 'W' : m.result === 'lost' ? 'L' : '·'}
                </Txt>
                {i < matches.length - 1 && <View style={styles.connector} />}
              </Pressable>
            ))}
          </Row>

          <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
            {matches.map((m) => {
              const mem = memoryForMatch(m.id);
              return (
                <Pressable
                  key={m.id}
                  onPress={() => mem && router.push(`/memory/${mem.id}`)}
                  style={styles.matchRow}
                >
                  <View style={{ flex: 1 }}>
                    <Txt variant="bodyStrong">{mem?.aiTitle ?? (m.opponentName ? `vs ${m.opponentName}` : 'A match')}</Txt>
                    <Txt variant="caption" color={colors.inkFaint}>
                      {formatDate(m.playedAt)}
                      {m.score ? ` · ${m.score}` : ''}
                    </Txt>
                  </View>
                  <Txt variant="micro" color={RESULT_COLOR[m.result]}>
                    {m.result.toUpperCase()}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <View style={{ height: spacing.xl }} />
      <Button
        label="⚡ Capture a match for this tournament"
        onPress={() => router.push({ pathname: '/capture', params: { tournamentId: tournament.id } })}
      />
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {},
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
});

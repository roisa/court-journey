import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { pickResurfaced } from '@/services/resurfacing';
import { MemoryCard } from '@/components/MemoryCard';
import { ResurfaceCard } from '@/components/ResurfaceCard';
import { Button, Card, Pill, Row, Screen, Txt } from '@/components/ui';
import { colors, spacing } from '@/theme';

type Filter = 'all' | 'tournaments';

export default function Journey() {
  const { state } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const resurfaced = useMemo(() => pickResurfaced(state), [state]);

  const memories = useMemo(() => {
    const sorted = [...state.memories].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
    return filter === 'tournaments' ? sorted.filter((m) => m.tournamentId) : sorted;
  }, [state.memories, filter]);

  const firstName = state.user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <Txt variant="micro" color={colors.inkFaint}>
        YOUR JOURNEY
      </Txt>
      <Txt variant="title" style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
        Hi {firstName} 👋
      </Txt>

      {resurfaced && (
        <ResurfaceCard
          item={resurfaced}
          onPress={() => router.push(`/memory/${resurfaced.memory.id}`)}
        />
      )}

      {state.memories.length === 0 ? (
        <EmptyState onCapture={() => router.push('/capture')} />
      ) : (
        <>
          <Row gap={spacing.sm} style={{ marginBottom: spacing.md }}>
            <Pill label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
            <Pill
              label="Tournaments"
              selected={filter === 'tournaments'}
              onPress={() => setFilter('tournaments')}
            />
          </Row>

          <View style={{ gap: spacing.md }}>
            {memories.map((m) => (
              <MemoryCard key={m.id} memory={m} onPress={() => router.push(`/memory/${m.id}`)} />
            ))}
          </View>

          {memories.length === 0 && (
            <Txt variant="body" color={colors.inkFaint} center style={{ marginTop: spacing.xl }}>
              No tournament memories yet. Group a match into a tournament to start a chapter.
            </Txt>
          )}
        </>
      )}
    </Screen>
  );
}

function EmptyState({ onCapture }: { onCapture: () => void }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
      <Txt variant="display">🎾</Txt>
      <Txt variant="heading" center style={{ marginTop: spacing.md }}>
        Your journey starts with one match.
      </Txt>
      <Txt variant="body" color={colors.inkSoft} center style={{ marginTop: spacing.sm }}>
        Just finished playing? Capture how it went in under 30 seconds — we’ll turn it into a
        memory worth keeping.
      </Txt>
      <View style={{ height: spacing.lg }} />
      <Button label="⚡ Capture your first match" onPress={onCapture} />
    </Card>
  );
}

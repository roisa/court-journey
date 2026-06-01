import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { pickResurfaced } from '@/services/resurfacing';
import { MemoryCard } from '@/components/MemoryCard';
import { ResurfaceCard } from '@/components/ResurfaceCard';
import { Button, Card, Screen, Segmented, Txt } from '@/components/ui';
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
      <View style={{ height: spacing.lg }} />
      <Txt variant="display" style={{ marginBottom: spacing.lg }}>
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
          <View style={{ marginBottom: spacing.lg }}>
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'tournaments', label: 'Tournaments' },
              ]}
            />
          </View>

          <View style={{ gap: spacing.md }}>
            {memories.map((m) => (
              <MemoryCard key={m.id} memory={m} onPress={() => router.push(`/memory/${m.id}`)} />
            ))}
          </View>

          {memories.length === 0 && (
            <Txt variant="body" color={colors.inkFaint} center style={{ marginTop: spacing.xl }}>
              No tournament memories yet.
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
        Start your story
      </Txt>
      <Txt variant="body" color={colors.inkSoft} center style={{ marginTop: spacing.xs }}>
        Capture a match in seconds.
      </Txt>
      <View style={{ height: spacing.lg }} />
      <Button label="⚡ Capture a match" onPress={onCapture} />
    </Card>
  );
}

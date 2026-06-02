import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { pickResurfaced } from '@/services/resurfacing';
import { MemoryCard } from '@/components/MemoryCard';
import { ResurfaceCard } from '@/components/ResurfaceCard';
import { Button, Card, GroupedList, GroupedRow, Screen, Segmented, Txt } from '@/components/ui';
import { Appear, Bob } from '@/components/motion';
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

  // First-run / zero-data state: center the invitation so the screen feels
  // intentional rather than a lone card over a void.
  if (state.memories.length === 0) {
    return (
      <Screen scroll={false} contentStyle={{ flex: 1 }}>
        <View style={{ height: spacing.lg }} />
        <Appear>
          <Txt variant="display">Hi {firstName} 👋</Txt>
        </Appear>

        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 96 }}>
          <Appear delay={80}>
            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Bob>
                <Txt variant="display">🎾</Txt>
              </Bob>
              <Txt variant="heading" center style={{ marginTop: spacing.md }}>
                Start your story
              </Txt>
              <Txt variant="body" color={colors.inkSoft} center style={{ marginTop: spacing.xs }}>
                Every match becomes a memory.
              </Txt>
              <View style={{ height: spacing.lg }} />
              <Button label="⚡ Capture a match" onPress={() => router.push('/capture')} />
            </Card>
          </Appear>

          <Appear delay={160}>
            <View style={{ marginTop: spacing.lg }}>
              <GroupedList>
                <GroupedRow
                  icon="🏆"
                  label="Plan a tournament"
                  onPress={() => router.push('/tournament/new')}
                />
                <GroupedRow
                  icon="🧠"
                  label="See how Learn works"
                  onPress={() => router.push('/(tabs)/learn')}
                />
              </GroupedList>
            </View>
          </Appear>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ height: spacing.lg }} />
      <Appear>
        <Txt variant="display" style={{ marginBottom: spacing.lg }}>
          Hi {firstName} 👋
        </Txt>
      </Appear>

      {resurfaced && (
        <Appear delay={60}>
          <ResurfaceCard
            item={resurfaced}
            onPress={() => router.push(`/memory/${resurfaced.memory.id}`)}
          />
        </Appear>
      )}

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

      {memories.length === 0 ? (
        <Txt variant="body" color={colors.inkFaint} center style={{ marginTop: spacing.xxl }}>
          No tournament memories yet.
        </Txt>
      ) : (
        <View style={{ gap: spacing.md }}>
          {memories.map((m, i) => (
            <Appear key={m.id} delay={Math.min(i, 8) * 55}>
              <MemoryCard memory={m} onPress={() => router.push(`/memory/${m.id}`)} />
            </Appear>
          ))}
        </View>
      )}
    </Screen>
  );
}

import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppStore';
import { deriveInsights } from '@/services/insights';
import { Button, Card, Pill, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

export default function Prepare() {
  const { state, toggleChecklistItem, addChecklistItem } = useApp();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [newItem, setNewItem] = useState('');

  const tournaments = useMemo(
    () =>
      [...state.tournaments].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
    [state.tournaments],
  );

  const tournament = tournaments.find((t) => t.id === selectedId) ?? tournaments[0];
  const checklist = tournament
    ? state.checklists.find((c) => c.tournamentId === tournament.id)
    : undefined;

  const confidence = useMemo(
    () => deriveInsights(state).find((i) => i.type === 'strength'),
    [state],
  );

  if (tournaments.length === 0) {
    return (
      <Screen>
        <Header />
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl, marginTop: spacing.lg }}>
          <Txt variant="display">🧘</Txt>
          <Txt variant="heading" center style={{ marginTop: spacing.md }}>
            No tournament on the horizon.
          </Txt>
          <Txt variant="body" color={colors.inkSoft} center style={{ marginTop: spacing.sm }}>
            When you’ve got one coming up, set it here and we’ll get you ready — calm and confident.
          </Txt>
          <View style={{ height: spacing.lg }} />
          <Button label="+ Plan a tournament" onPress={() => router.push('/tournament/new')} />
        </Card>
      </Screen>
    );
  }

  const done = checklist?.items.filter((i) => i.isChecked).length ?? 0;
  const total = checklist?.items.length ?? 0;
  const allDone = total > 0 && done === total;

  return (
    <Screen>
      <Header />

      {tournaments.length > 1 && (
        <Row gap={spacing.sm} style={{ flexWrap: 'wrap', marginTop: spacing.md }}>
          {tournaments.map((t) => (
            <Pill
              key={t.id}
              label={t.name}
              selected={tournament?.id === t.id}
              onPress={() => setSelectedId(t.id)}
            />
          ))}
        </Row>
      )}

      {tournament && (
        <Card tone="court" style={{ marginTop: spacing.lg }}>
          <Txt variant="micro" color={colors.onCourtSoft}>
            GETTING READY FOR
          </Txt>
          <Txt variant="title" color={colors.onCourt} style={{ marginTop: spacing.xs }}>
            {tournament.name}
          </Txt>
          {tournament.venue ? (
            <Txt variant="body" color={colors.onCourtSoft} style={{ marginTop: spacing.xs }}>
              📍 {tournament.venue}
            </Txt>
          ) : null}
          <Txt variant="caption" color={colors.onCourtSoft} style={{ marginTop: spacing.sm }}>
            {done}/{total} ready
          </Txt>
        </Card>
      )}

      {confidence && (
        <Card style={{ marginTop: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.win }}>
          <Txt variant="micro" color={colors.win}>
            CONFIDENCE FROM YOUR HISTORY
          </Txt>
          <Txt variant="body" style={{ marginTop: spacing.xs }}>
            {confidence.narrative}
          </Txt>
        </Card>
      )}

      {checklist && (
        <>
          <SectionTitle>{checklist.name}</SectionTitle>
          <View style={{ gap: spacing.sm }}>
            {checklist.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleChecklistItem(checklist.id, item.id)}
                style={[styles.item, item.isChecked && styles.itemDone]}
              >
                <View style={[styles.check, item.isChecked && styles.checkOn]}>
                  {item.isChecked && (
                    <Txt variant="caption" color={colors.onCourt}>
                      ✓
                    </Txt>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Txt
                    variant="bodyStrong"
                    color={item.isChecked ? colors.inkFaint : colors.ink}
                    style={item.isChecked ? { textDecorationLine: 'line-through' } : undefined}
                  >
                    {item.text}
                  </Txt>
                  {item.why ? (
                    <Txt variant="caption" color={colors.inkFaint} style={{ marginTop: 2 }}>
                      {item.why}
                    </Txt>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Add custom item */}
          <Row gap={spacing.sm} style={{ marginTop: spacing.md }}>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add your own item…"
              placeholderTextColor={colors.inkFaint}
              style={styles.addInput}
            />
            <Button
              label="Add"
              variant="secondary"
              onPress={() => {
                addChecklistItem(checklist.id, newItem);
                setNewItem('');
              }}
            />
          </Row>

          {allDone && (
            <Card tone="court" style={{ marginTop: spacing.lg, alignItems: 'center' }}>
              <Txt variant="display">🎾</Txt>
              <Txt variant="heading" color={colors.onCourt} center style={{ marginTop: spacing.sm }}>
                You’re ready. Go enjoy it.
              </Txt>
            </Card>
          )}
        </>
      )}

      <View style={{ height: spacing.lg }} />
      <Button label="+ Plan another tournament" variant="ghost" onPress={() => router.push('/tournament/new')} />
    </Screen>
  );
}

function Header() {
  return (
    <>
      <View style={{ height: spacing.md }} />
      <Txt variant="micro" color={colors.inkFaint}>
        PREPARE
      </Txt>
      <Txt variant="title" style={{ marginTop: spacing.xs }}>
        Walk on calm and ready.
      </Txt>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  itemDone: { backgroundColor: colors.surfaceAlt },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.court,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkOn: { backgroundColor: colors.court },
  addInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.ink,
  },
});

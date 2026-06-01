import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { useApp } from '@/store/AppStore';
import { feelingOption } from '@/data/feelings';
import { themeLabel } from '@/data/tags';
import { formatDate } from '@/lib/date';
import { Button, Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

export default function MemoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, editMemoryStory } = useApp();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const memory = state.memories.find((m) => m.id === id);
  const match = memory?.matchId ? state.matches.find((m) => m.id === memory.matchId) : undefined;
  const tournament = memory?.tournamentId
    ? state.tournaments.find((t) => t.id === memory.tournamentId)
    : undefined;
  const photos = memory ? state.photos.filter((p) => memory.photoIds.includes(p.id)) : [];
  const voice = memory ? state.voiceNotes.find((v) => memory.voiceNoteIds.includes(v.id)) : undefined;
  const lessons = memory ? state.lessons.filter((l) => memory.lessonIds.includes(l.id)) : [];
  const feeling = feelingOption(memory?.feeling);

  const player = useAudioPlayer(voice?.uri ?? undefined);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(memory?.aiTitle ?? '');
  const [story, setStory] = useState(memory?.aiStory ?? '');

  if (!memory) {
    return (
      <Screen>
        <Txt variant="heading" style={{ marginTop: spacing.xl }}>
          This memory isn’t here.
        </Txt>
        <View style={{ height: spacing.lg }} />
        <Button label="Back to journey" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  function saveEdits() {
    editMemoryStory(memory!.id, title.trim() || 'A match', story.trim());
    setEditing(false);
  }

  return (
    <Screen padded={false}>
      {photos.length > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {photos.map((p) => (
            <Image
              key={p.id}
              source={{ uri: p.uri }}
              style={[styles.hero, { width }]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={{ paddingHorizontal: spacing.lg }}>
        <View style={{ height: spacing.lg }} />
        <Row gap={spacing.sm}>
          {match && (
            <Txt
              variant="micro"
              color={
                match.result === 'won' ? colors.win : match.result === 'lost' ? colors.loss : colors.neutralPlay
              }
            >
              {match.result.toUpperCase()}
            </Txt>
          )}
          <Txt variant="micro" color={colors.inkFaint}>
            {formatDate(memory.occurredAt).toUpperCase()}
          </Txt>
          <View style={{ flex: 1 }} />
          {feeling && (
            <Txt variant="body">
              {feeling.emoji} {feeling.label}
            </Txt>
          )}
        </Row>

        {editing ? (
          <TextInput value={title} onChangeText={setTitle} style={styles.titleInput} multiline />
        ) : (
          <Txt variant="title" style={{ marginTop: spacing.sm }}>
            {memory.aiTitle}
          </Txt>
        )}

        {/* Match facts */}
        {(match?.opponentName || match?.score || match?.venue) && (
          <Row gap={spacing.md} style={{ marginTop: spacing.sm, flexWrap: 'wrap' }}>
            {match?.opponentName ? (
              <Txt variant="caption" color={colors.inkSoft}>
                vs {match.opponentName}
              </Txt>
            ) : null}
            {match?.score ? (
              <Txt variant="caption" color={colors.inkSoft}>
                {match.score}
              </Txt>
            ) : null}
            {match?.venue ? (
              <Txt variant="caption" color={colors.inkSoft}>
                📍 {match.venue}
              </Txt>
            ) : null}
          </Row>
        )}

        {/* The AI-written journal entry */}
        <View style={{ height: spacing.lg }} />
        {editing ? (
          <TextInput
            value={story}
            onChangeText={setStory}
            style={styles.storyInput}
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Txt variant="prose" color={colors.ink}>
            {memory.aiStory}
          </Txt>
        )}

        {editing ? (
          <Row gap={spacing.sm} style={{ marginTop: spacing.lg }}>
            <Button label="Save" onPress={saveEdits} style={{ flex: 1 }} />
            <Button label="Cancel" variant="secondary" onPress={() => setEditing(false)} style={{ flex: 1 }} />
          </Row>
        ) : (
          <Pressable onPress={() => setEditing(true)} style={{ marginTop: spacing.md }}>
            <Txt variant="label" color={colors.court}>
              ✎ Edit this entry
            </Txt>
          </Pressable>
        )}

        {/* Voice note — your own past voice */}
        {voice && (
          <>
            <SectionTitle>Your voice</SectionTitle>
            <Card>
              <Row gap={spacing.md}>
                <Pressable
                  onPress={() => {
                    player.seekTo(0);
                    player.play();
                  }}
                  style={styles.playBtn}
                >
                  <Txt variant="heading" color={colors.onCourt}>
                    ▶
                  </Txt>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Txt variant="bodyStrong">Play your voice note</Txt>
                  <Txt variant="caption" color={colors.inkFaint}>
                    {voice.durationSec ? `${voice.durationSec}s · ` : ''}the way it really felt
                  </Txt>
                </View>
              </Row>
              {voice.transcript ? (
                <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.md, fontStyle: 'italic' }}>
                  “{voice.transcript}”
                </Txt>
              ) : null}
            </Card>
          </>
        )}

        {/* Lessons */}
        {lessons.length > 0 && (
          <>
            <SectionTitle>What you took from it</SectionTitle>
            <View style={{ gap: spacing.sm }}>
              {lessons.map((l) => (
                <Row key={l.id} gap={spacing.sm} style={styles.lessonRow}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          l.polarity === 'strength'
                            ? colors.win
                            : l.polarity === 'weakness'
                              ? colors.clay
                              : colors.inkFaint,
                      },
                    ]}
                  />
                  <Txt variant="body" style={{ flex: 1 }}>
                    {l.text}
                  </Txt>
                  <Txt variant="micro" color={colors.inkFaint}>
                    {themeLabel(l.theme).toUpperCase()}
                  </Txt>
                </Row>
              ))}
            </View>
          </>
        )}

        {/* Tournament link */}
        {tournament && (
          <Card
            style={{ marginTop: spacing.xl }}
            onPress={() => router.push(`/tournament/${tournament.id}`)}
          >
            <Txt variant="micro" color={colors.inkFaint}>
              PART OF
            </Txt>
            <Txt variant="heading" style={{ marginTop: spacing.xs }}>
              {tournament.name} →
            </Txt>
          </Card>
        )}

        <View style={{ height: spacing.xxxl }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 260, backgroundColor: colors.surfaceAlt },
  titleInput: {
    marginTop: spacing.sm,
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    borderBottomWidth: 1.5,
    borderColor: colors.hairline,
  },
  storyInput: {
    minHeight: 180,
    fontSize: 17,
    lineHeight: 27,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    padding: spacing.md,
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.court,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

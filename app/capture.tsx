import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Feeling, Outcome } from '@/types/models';
import { useApp } from '@/store/AppStore';
import { FEELINGS } from '@/data/feelings';
import { REFLECTION_CHIPS } from '@/data/tags';
import { Button, Card, Pill, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { VoiceRecorder, type VoiceCapture } from '@/components/VoiceRecorder';
import { PhotoPicker } from '@/components/PhotoPicker';
import { colors, radii, spacing } from '@/theme';

const OUTCOMES: { value: Outcome; label: string; color: string; tint: string }[] = [
  { value: 'won', label: 'Won 🎉', color: colors.win, tint: colors.courtTint },
  { value: 'lost', label: 'Lost 😞', color: colors.loss, tint: '#F7E3E1' },
  { value: 'played', label: 'Just played 🎾', color: colors.neutralPlay, tint: colors.surfaceAlt },
];

export default function Capture() {
  const { state, captureMatch } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams<{ tournamentId?: string }>();
  const sport = state.user?.primarySport ?? 'tennis';

  const [result, setResult] = useState<Outcome | null>(null);
  const [feeling, setFeeling] = useState<Feeling | undefined>();
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [voice, setVoice] = useState<VoiceCapture | undefined>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [score, setScore] = useState('');
  const [venue, setVenue] = useState(state.user?.homeVenue ?? '');
  const [tournamentId, setTournamentId] = useState<string | undefined>(params.tournamentId);
  const [saving, setSaving] = useState(false);

  function toggleChip(label: string) {
    setChips((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));
  }

  // Suggested chips first: a player's recurring weakness themes surface early.
  const orderedChips = REFLECTION_CHIPS;

  async function save() {
    if (!result) return;
    setSaving(true);
    try {
      const id = await captureMatch({
        result,
        feeling,
        sport,
        opponentName: opponent.trim() || undefined,
        score: score.trim() || undefined,
        venue: venue.trim() || undefined,
        tournamentId,
        transcript: note.trim() || undefined,
        chipLabels: chips,
        photoUris: photos,
        voice: voice && (voice.uri || voice.durationSec) ? voice : undefined,
      });
      router.replace(`/memory/${id}`);
    } catch {
      setSaving(false);
    }
  }

  if (saving) {
    return (
      <Screen scroll={false}>
        <View style={styles.savingWrap}>
          <Txt variant="display">✍️</Txt>
          <Txt variant="heading" center style={{ marginTop: spacing.md }}>
            Writing your memory…
          </Txt>
          <Txt variant="body" color={colors.inkSoft} center style={{ marginTop: spacing.xs }}>
            One moment.
          </Txt>
          <ActivityIndicator color={colors.court} style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ height: spacing.md }} />

      {/* 1 — Outcome (the only required step) */}
      <Txt variant="title">How’d it go?</Txt>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {OUTCOMES.map((o) => (
          <Pressable
            key={o.value}
            onPress={() => setResult(o.value)}
            style={({ pressed }) => [
              styles.outcome,
              result === o.value && { borderColor: o.color, backgroundColor: o.tint },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Txt variant="bodyStrong" color={result === o.value ? o.color : colors.ink}>
              {o.label}
            </Txt>
            {result === o.value && <Txt variant="bodyStrong" color={o.color}>✓</Txt>}
          </Pressable>
        ))}
      </View>

      {result && (
        <>
          {/* 2 — Feeling */}
          <SectionTitle>How do you feel?</SectionTitle>
          <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
            {FEELINGS.map((f) => (
              <Pressable
                key={f.value}
                onPress={() => setFeeling(f.value)}
                style={[styles.feeling, feeling === f.value && styles.feelingOn]}
              >
                <Txt variant="title">{f.emoji}</Txt>
                <Txt variant="caption" color={feeling === f.value ? colors.court : colors.inkFaint}>
                  {f.label}
                </Txt>
              </Pressable>
            ))}
          </Row>

          {/* 3 — The one thing to remember */}
          <SectionTitle>
            {result === 'lost' ? 'What’s one thing you’ll take from it?' : 'What’s the one thing to remember?'}
          </SectionTitle>
          <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
            {orderedChips.map((c) => (
              <Pill
                key={c.label}
                label={c.label}
                selected={chips.includes(c.label)}
                tone={c.polarity === 'strength' ? 'strength' : c.polarity === 'weakness' ? 'weakness' : 'default'}
                onPress={() => toggleChip(c.label)}
              />
            ))}
          </Row>

          <View style={{ height: spacing.md }} />
          <VoiceRecorder value={voice} onChange={setVoice} />

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="…or jot a line in your own words (optional)"
            placeholderTextColor={colors.inkFaint}
            multiline
            style={styles.note}
          />

          <SectionTitle>Photos</SectionTitle>
          <PhotoPicker uris={photos} onChange={setPhotos} />

          {/* Optional details */}
          <Pressable onPress={() => setShowDetails((s) => !s)} style={{ marginTop: spacing.xl }}>
            <Txt variant="label" color={colors.court}>
              {showDetails ? '− Hide details' : '+ Add details (opponent, score, venue)'}
            </Txt>
          </Pressable>

          {showDetails && (
            <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
              <Field label="Opponent" value={opponent} onChange={setOpponent} placeholder="e.g. Marco" />
              <Field label="Score" value={score} onChange={setScore} placeholder="e.g. 6-4 3-6 7-5" />
              <Field label="Venue" value={venue} onChange={setVenue} placeholder="Where you played" />
              {state.tournaments.length > 0 && (
                <View>
                  <Txt variant="label" color={colors.inkSoft} style={{ marginBottom: spacing.sm }}>
                    Part of a tournament?
                  </Txt>
                  <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
                    <Pill label="No" selected={!tournamentId} onPress={() => setTournamentId(undefined)} />
                    {state.tournaments.map((t) => (
                      <Pill
                        key={t.id}
                        label={t.name}
                        selected={tournamentId === t.id}
                        onPress={() => setTournamentId(t.id)}
                      />
                    ))}
                  </Row>
                </View>
              )}
            </Card>
          )}

          <View style={{ height: spacing.xl }} />
          <Button label="Save this memory" onPress={save} />
          <View style={{ height: spacing.xl }} />
        </>
      )}
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View>
      <Txt variant="label" color={colors.inkSoft} style={{ marginBottom: spacing.xs }}>
        {label}
      </Txt>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        style={styles.field}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outcome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  feeling: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 64,
  },
  feelingOn: { borderColor: colors.court, backgroundColor: colors.surface },
  note: {
    marginTop: spacing.md,
    minHeight: 70,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  field: {
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.ink,
  },
  savingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
});

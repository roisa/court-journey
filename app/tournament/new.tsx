import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Sport, Stakes } from '@/types/models';
import { useApp } from '@/store/AppStore';
import { Button, Pill, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const STAKES: { value: Stakes; label: string; hint: string }[] = [
  { value: 'casual', label: '😌 Casual', hint: 'Social, just for fun' },
  { value: 'regular', label: '🎯 Regular', hint: 'A normal tournament' },
  { value: 'high', label: '🏆 High-stakes', hint: 'This one matters' },
];

export default function NewTournament() {
  const { state, createTournament } = useApp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [sport, setSport] = useState<Sport>(state.user?.primarySport ?? 'tennis');
  const [stakes, setStakes] = useState<Stakes>('regular');

  function create() {
    const id = createTournament({
      name,
      venue: venue.trim() || undefined,
      city: city.trim() || undefined,
      sport,
      stakes,
    });
    router.replace(`/tournament/${id}`);
  }

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <Txt variant="title">New tournament</Txt>
      <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
        We’ll set up the right prep checklist based on your experience and how much this one matters.
      </Txt>

      <SectionTitle>Name</SectionTitle>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Spring Club Championship"
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
      />

      <SectionTitle>Sport</SectionTitle>
      <Row gap={spacing.sm}>
        <Pill label="🎾 Tennis" selected={sport === 'tennis'} onPress={() => setSport('tennis')} />
        <Pill label="🟦 Padel" selected={sport === 'padel'} onPress={() => setSport('padel')} />
      </Row>

      <SectionTitle>Venue & city</SectionTitle>
      <TextInput
        value={venue}
        onChangeText={setVenue}
        placeholder="Venue"
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
      />
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="City"
        placeholderTextColor={colors.inkFaint}
        style={[styles.input, { marginTop: spacing.sm }]}
      />

      <SectionTitle>How much does this one matter?</SectionTitle>
      <View style={{ gap: spacing.sm }}>
        {STAKES.map((s) => (
          <Pill
            key={s.value}
            label={`${s.label} — ${s.hint}`}
            selected={stakes === s.value}
            onPress={() => setStakes(s.value)}
          />
        ))}
      </View>

      <View style={{ height: spacing.xxl }} />
      <Button label="Create tournament" onPress={create} disabled={!name.trim()} />
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.ink,
  },
});

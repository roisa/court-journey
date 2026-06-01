import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Intent, Sport } from '@/types/models';
import { useApp } from '@/store/AppStore';
import { Button, Pill, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const INTENTS: { value: Intent; label: string }[] = [
  { value: 'remember', label: '📸 Remember' },
  { value: 'improve', label: '📈 Improve' },
  { value: 'prepare', label: '🧘 Feel ready' },
];

const LEVELS = ['Just starting', 'Getting there', 'Competitor', 'Seasoned'];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [sport, setSport] = useState<Sport>('tennis');
  const [level, setLevel] = useState(LEVELS[1]);
  const [venue, setVenue] = useState('');
  const [intents, setIntents] = useState<Intent[]>(['remember']);

  function toggleIntent(i: Intent) {
    setIntents((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function start() {
    completeOnboarding({
      displayName: name,
      primarySport: sport,
      skillLevel: level,
      homeVenue: venue.trim() || undefined,
      intents,
    });
    router.replace('/(tabs)');
  }

  return (
    <Screen>
      <View style={{ height: spacing.xxl }} />
      <Txt variant="micro" color={colors.clay}>
        COURT JOURNEY
      </Txt>
      <Txt variant="display" style={{ marginTop: spacing.sm }}>
        Your story{'\n'}on court.
      </Txt>
      <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.sm }}>
        The matches, lessons and feelings worth keeping.
      </Txt>

      <SectionTitle>Your name</SectionTitle>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
        returnKeyType="next"
      />

      <SectionTitle>Your sport</SectionTitle>
      <Row gap={spacing.sm}>
        <Pill label="🎾 Tennis" selected={sport === 'tennis'} onPress={() => setSport('tennis')} />
        <Pill label="🟦 Padel" selected={sport === 'padel'} onPress={() => setSport('padel')} />
      </Row>

      <SectionTitle>Your level</SectionTitle>
      <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
        {LEVELS.map((l) => (
          <Pill key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />
        ))}
      </Row>

      <SectionTitle>Why you’re here</SectionTitle>
      <Row gap={spacing.sm} style={{ flexWrap: 'wrap' }}>
        {INTENTS.map((i) => (
          <Pill
            key={i.value}
            label={i.label}
            selected={intents.includes(i.value)}
            onPress={() => toggleIntent(i.value)}
          />
        ))}
      </Row>

      <SectionTitle>Home court (optional)</SectionTitle>
      <TextInput
        value={venue}
        onChangeText={setVenue}
        placeholder="e.g. Riverside Tennis Club"
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
      />

      <View style={{ height: spacing.xxl }} />
      <Button label="Start  🎾" onPress={start} />
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

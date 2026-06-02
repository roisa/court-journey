import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useApp } from '@/store/AppStore';
import { Button, Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Bob } from '@/components/motion';
import { colors, radii, spacing } from '@/theme';

const SYNC_LABEL: Record<string, string> = {
  off: 'Local only',
  syncing: 'Syncing…',
  synced: 'Backed up',
  error: 'Sync error',
};

export default function Sync() {
  const { auth } = useApp();
  const [email, setEmail] = useState('');

  if (!auth.configured) {
    return (
      <Screen>
        <View style={{ height: spacing.lg }} />
        <Bob>
          <Txt variant="display">☁️</Txt>
        </Bob>
        <Txt variant="title" style={{ marginTop: spacing.md }}>
          Cloud sync isn’t set up
        </Txt>
        <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.sm }}>
          This build runs fully on-device. To back up and sync your journey across devices, add a
          free Supabase project’s URL and anon key, then redeploy. Setup steps are in the repo’s
          README.
        </Txt>
      </Screen>
    );
  }

  if (auth.email) {
    return (
      <Screen>
        <View style={{ height: spacing.lg }} />
        <Bob>
          <Txt variant="display">✅</Txt>
        </Bob>
        <Txt variant="title" style={{ marginTop: spacing.md }}>
          You’re backed up
        </Txt>
        <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
          Signed in as {auth.email}
        </Txt>

        <Card style={{ marginTop: spacing.lg }}>
          <Row>
            <Txt variant="bodyStrong" style={{ flex: 1 }}>
              Status
            </Txt>
            <Txt variant="body" color={auth.syncStatus === 'error' ? colors.loss : colors.win}>
              {SYNC_LABEL[auth.syncStatus]}
            </Txt>
          </Row>
        </Card>

        <Txt variant="caption" color={colors.inkFaint} style={{ marginTop: spacing.md }}>
          Your journey syncs automatically. Sign in with the same email on another device to pick up
          where you left off.
        </Txt>

        <View style={{ height: spacing.xl }} />
        <Button label="Sign out" variant="secondary" onPress={() => void auth.signOut()} />
      </Screen>
    );
  }

  const sent = auth.magicStatus === 'sent';
  const sending = auth.magicStatus === 'sending';

  return (
    <Screen>
      <View style={{ height: spacing.lg }} />
      <Bob>
        <Txt variant="display">☁️</Txt>
      </Bob>
      <Txt variant="title" style={{ marginTop: spacing.md }}>
        Back up & sync
      </Txt>
      <Txt variant="body" color={colors.inkSoft} style={{ marginTop: spacing.sm }}>
        Get a sign-in link by email — no password. Your journey is saved to the cloud and synced
        across your devices.
      </Txt>

      {sent ? (
        <Card tone="court" style={{ marginTop: spacing.xl }}>
          <Txt variant="heading" color={colors.onCourt}>
            Check your email 📬
          </Txt>
          <Txt variant="body" color={colors.onCourtSoft} style={{ marginTop: spacing.xs }}>
            Tap the link we sent to {email || 'your inbox'} to finish signing in.
          </Txt>
        </Card>
      ) : (
        <>
          <SectionTitle>Your email</SectionTitle>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.inkFaint}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
          />
          {auth.magicStatus === 'error' && (
            <Txt variant="caption" color={colors.loss} style={{ marginTop: spacing.xs }}>
              Couldn’t send the link. Check the address and try again.
            </Txt>
          )}
          <View style={{ height: spacing.lg }} />
          <Button
            label={sending ? 'Sending…' : 'Send my sign-in link'}
            onPress={() => void auth.signInWithEmail(email)}
            disabled={!email.includes('@') || sending}
            loading={sending}
          />
        </>
      )}

      <Txt variant="caption" color={colors.inkFaint} center style={{ marginTop: spacing.xxl }}>
        Free & private. You can keep using the app without signing in.
      </Txt>
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

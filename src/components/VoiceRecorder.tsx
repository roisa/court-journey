import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { colors, radii, spacing } from '@/theme';
import { Row, Txt } from './ui';

export interface VoiceCapture {
  uri?: string;
  durationSec?: number;
}

/**
 * Hold-to-talk voice capture (docs/05 — voice-first). Records audio and reports
 * the resulting clip. Transcription is left to the AI layer / a future STT
 * service; here we keep the precious raw audio, which is the point.
 */
export function VoiceRecorder({
  value,
  onChange,
}: {
  value?: VoiceCapture;
  onChange: (v: VoiceCapture | undefined) => void;
}) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  async function start() {
    try {
      setError(null);
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setError('Mic permission needed to record a voice note.');
        return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
      setElapsed(0);
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError('Couldn’t start recording on this device.');
    }
  }

  async function stop() {
    try {
      if (timer.current) clearInterval(timer.current);
      await recorder.stop();
      setRecording(false);
      onChange({ uri: recorder.uri ?? undefined, durationSec: elapsed });
    } catch {
      setRecording(false);
      setError('Couldn’t save the recording.');
    }
  }

  if (value?.uri || (value?.durationSec ?? 0) > 0) {
    return (
      <Row style={styles.saved} gap={spacing.sm}>
        <Txt variant="body">🎙</Txt>
        <Txt variant="bodyStrong" color={colors.court} style={{ flex: 1 }}>
          Voice note saved{value?.durationSec ? ` · ${value.durationSec}s` : ''}
        </Txt>
        <Pressable onPress={() => onChange(undefined)} hitSlop={8}>
          <Txt variant="label" color={colors.inkFaint}>
            Remove
          </Txt>
        </Pressable>
      </Row>
    );
  }

  return (
    <View>
      <Pressable
        onPress={recording ? stop : start}
        style={({ pressed }) => [
          styles.btn,
          recording ? styles.recording : styles.idle,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Txt variant="bodyStrong" color={recording ? colors.onCourt : colors.court}>
          {recording ? `■  Stop · ${elapsed}s` : '🎙  Hold the thought — record a voice note'}
        </Txt>
      </Pressable>
      {error && (
        <Txt variant="caption" color={colors.loss} style={{ marginTop: spacing.xs }}>
          {error}
        </Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  idle: { backgroundColor: colors.surface, borderColor: colors.court },
  recording: { backgroundColor: colors.clay, borderColor: colors.clay },
  saved: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
  },
});

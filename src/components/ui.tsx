import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, shadow, spacing, typography } from '@/theme';

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

type TxtVariant = keyof typeof typography;

interface TxtProps extends TextProps {
  variant?: TxtVariant;
  color?: string;
  center?: boolean;
}

export function Txt({ variant = 'body', color = colors.ink, center, style, ...rest }: TxtProps) {
  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        { color },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Screen wrapper
// ---------------------------------------------------------------------------

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  background = colors.paper,
  contentStyle,
}: ScreenProps) {
  const inner = (
    <View style={[padded && { paddingHorizontal: spacing.lg }, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }]} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'court';
}

export function Card({ children, onPress, style, tone = 'surface' }: CardProps) {
  const bg = tone === 'court' ? colors.court : colors.surface;
  const body = (
    <View style={[styles.card, { backgroundColor: bg }, shadow.card, style]}>{children}</View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {body}
      </Pressable>
    );
  }
  return body;
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary && { backgroundColor: colors.court },
        variant === 'secondary' && { backgroundColor: colors.courtTint },
        isGhost && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.5 },
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onCourt : colors.court} />
      ) : (
        <Text
          style={[
            typography.bodyStrong,
            { color: isPrimary ? colors.onCourt : colors.court },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Pill (selectable chip)
// ---------------------------------------------------------------------------

interface PillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'default' | 'strength' | 'weakness';
}

export function Pill({ label, selected, onPress, tone = 'default' }: PillProps) {
  const selectedBg =
    tone === 'strength' ? colors.win : tone === 'weakness' ? colors.clay : colors.court;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected ? { backgroundColor: selectedBg, borderColor: selectedBg } : styles.pillIdle,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          typography.label,
          { color: selected ? colors.onCourt : colors.inkSoft },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Txt variant="micro" color={colors.inkFaint} style={styles.sectionTitle}>
      {String(children).toUpperCase()}
    </Txt>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Row({
  children,
  style,
  gap = spacing.sm,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

// ---------------------------------------------------------------------------
// Segmented control (iOS-style)
// ---------------------------------------------------------------------------

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.segmentItem, on && styles.segmentItemOn]}
          >
            <Text
              style={[
                typography.label,
                { color: on ? colors.court : colors.inkSoft, fontWeight: on ? '700' : '600' },
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  button: {
    height: 50,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1.5,
  },
  pillIdle: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.surfaceAlt,
  },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs },
  divider: { height: 1, backgroundColor: colors.hairline, marginVertical: spacing.lg },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 3,
  },
  segmentItem: {
    flex: 1,
    height: 34,
    borderRadius: radii.md - 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemOn: {
    backgroundColor: colors.surface,
    ...shadow.card,
  },
});

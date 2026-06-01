import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/store/AppStore';
import { achievementByCode } from '@/data/achievements';
import { colors, radii, shadow, spacing } from '@/theme';
import { Txt } from './ui';

/**
 * Celebration banner for newly-unlocked achievements (docs/09). An unlock is a
 * *moment*, not a generic confetti dump — one tasteful, personalized line.
 */
export function AchievementToast() {
  const { recentlyUnlocked, clearRecentlyUnlocked } = useApp();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  const code = recentlyUnlocked[0];
  const achievement = code ? achievementByCode(code) : undefined;

  useEffect(() => {
    if (!achievement) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
    const timer = setTimeout(dismiss, 3800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function dismiss() {
    Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
      clearRecentlyUnlocked();
    });
  }

  if (!achievement) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        { top: insets.top + spacing.sm },
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }) },
          ],
        },
      ]}
    >
      <Pressable onPress={dismiss} style={[styles.toast, shadow.floating]}>
        <Txt variant="display" style={{ marginRight: spacing.md }}>
          🏅
        </Txt>
        <Txt variant="bodyStrong" color={colors.onCourt} style={{ flex: 1 }}>
          Achievement unlocked{'\n'}
          <Txt variant="body" color={colors.onCourtSoft}>
            {achievement.title} — {achievement.description}
          </Txt>
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.courtDark,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
});

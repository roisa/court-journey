import React, { useEffect } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * Small motion layer to make the app feel alive (docs/10 — delight).
 * Tasteful, GPU-friendly, and used sparingly: entrance, ambient float, and
 * tactile press feedback.
 */

/** Fade + rise into place. Stagger lists by passing an increasing `delay`. */
export function Appear({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(420).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Gentle, endless vertical bob — great for hero emojis on empty states. */
export function Bob({
  children,
  amplitude = 8,
  duration = 1500,
  style,
}: {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withTiming(-amplitude, { duration, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [amplitude, duration, y]);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[animated, style]}>{children}</Animated.View>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable that springs down on touch — tactile, "physical" feedback. */
export function PressableScale({
  children,
  style,
  scaleTo = 0.96,
  ...rest
}: PressableProps & { children: React.ReactNode; style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const s = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        s.value = withSpring(scaleTo, { mass: 0.4, damping: 12 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, { mass: 0.4, damping: 10 });
        rest.onPressOut?.(e);
      }}
      style={[animated, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** A slow, living pulse — draws the eye without nagging (e.g. the ⚡ button). */
export function useLivingPulse() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(1.08, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 700, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [scale]);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}

export { Animated };

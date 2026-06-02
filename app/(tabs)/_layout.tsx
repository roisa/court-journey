import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated, useLivingPulse } from '@/components/motion';
import { colors, shadow } from '@/theme';

/** Frosted, translucent tab bar background — the iOS "Liquid Glass" surface. */
function TabBarBlur() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView tint="light" intensity={40} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(250,252,250,0.72)' }]} />
    </View>
  );
}

/** Emoji tab icon (keeps us free of an icon-font dependency). */
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

/**
 * Floating ⚡ Capture button. It opens the /capture modal directly rather than
 * routing through a placeholder tab — that placeholder was the blank screen
 * that flashed before the modal appeared.
 */
function CaptureFab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulse = useLivingPulse();
  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', alignItems: 'center' }]}
    >
      <Animated.View style={[{ marginBottom: insets.bottom + 14 }, pulse]}>
        <Pressable
          accessibilityLabel="Capture a match"
          accessibilityRole="button"
          onPress={() => router.push('/capture')}
          style={({ pressed }) => [
            styles.captureBtn,
            shadow.floating,
            pressed && { opacity: 0.9, transform: [{ scale: 0.94 }] },
          ]}
        >
          <Text style={styles.captureIcon}>⚡</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.court,
          tabBarInactiveTintColor: colors.inkFaint,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => <TabBarBlur />,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Journey',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🧠" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="prepare"
          options={{
            title: 'Prepare',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏅" focused={focused} />,
          }}
        />
      </Tabs>
      <CaptureFab />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopColor: colors.separator,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    height: 66,
    paddingTop: 8,
    paddingBottom: 8,
  },
  captureBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.court,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.paper,
  },
  captureIcon: { fontSize: 27, color: colors.onCourt },
});

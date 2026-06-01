import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
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

/** The raised center ⚡ Capture button — the heart of the app (docs/03). */
function CaptureButton() {
  const router = useRouter();
  return (
    <View style={styles.captureWrap} pointerEvents="box-none">
      <Pressable
        accessibilityLabel="Capture a match"
        accessibilityRole="button"
        onPress={() => router.push('/capture')}
        style={({ pressed }) => [styles.captureBtn, shadow.floating, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.captureIcon}>⚡</Text>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  return (
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
        name="capture"
        options={{
          title: '',
          tabBarButton: () => <CaptureButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/capture');
          },
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
  captureWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    position: 'absolute',
    bottom: 4,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.court,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.paper,
  },
  captureIcon: { fontSize: 26, color: colors.onCourt },
});

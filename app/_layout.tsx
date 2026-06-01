import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '@/store/AppStore';
import { AchievementToast } from '@/components/AchievementToast';
import { colors } from '@/theme';

function RootNavigator() {
  const { hydrated, state } = useApp();
  const segments = useSegments();
  const router = useRouter();

  // Onboarding gate: route based on whether a player profile exists.
  useEffect(() => {
    if (!hydrated) return;
    const onOnboarding = segments[0] === 'onboarding';
    if (!state.user && !onOnboarding) {
      router.replace('/onboarding');
    } else if (state.user && onOnboarding) {
      router.replace('/(tabs)');
    }
  }, [hydrated, state.user, segments, router]);

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.paper }} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.court,
          headerTitleStyle: { color: colors.ink },
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="capture"
          options={{ presentation: 'modal', title: 'Capture a match' }}
        />
        <Stack.Screen
          name="tournament/new"
          options={{ presentation: 'modal', title: 'New tournament' }}
        />
        <Stack.Screen name="memory/[id]" options={{ title: 'Memory' }} />
        <Stack.Screen name="tournament/[id]" options={{ title: 'Tournament' }} />
        <Stack.Screen name="achievements" options={{ title: 'Achievements' }} />
      </Stack>
      <AchievementToast />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

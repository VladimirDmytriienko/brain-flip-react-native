import React from 'react';
import { Stack } from 'expo-router';
import Toast from '@/components/Toast/Toast';

export default function RootLayout() {
  return (
    <>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </>
  );
}

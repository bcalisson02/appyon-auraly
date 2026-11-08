import { Stack } from 'expo-router';
import { View } from 'react-native';

import { Toast } from '@/features/auraly/components/Toast';
import { colors } from '@/features/auraly/theme';

export default function AuralyLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" />
        <Stack.Screen
          name="scan"
          options={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom', contentStyle: { backgroundColor: colors.bgScan } }}
        />
        <Stack.Screen name="reading" />
        <Stack.Screen name="readings" />
        <Stack.Screen name="conversations" />
        <Stack.Screen name="conversation/[id]" />
        <Stack.Screen name="demo" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <Toast />
    </View>
  );
}

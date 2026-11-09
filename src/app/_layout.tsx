import { Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold } from '@expo-google-fonts/geist';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useAuraly } from '@/features/auraly/store';
import { appWidthFor, colors, fonts } from '@/features/auraly/theme';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, primary: colors.lavender, text: colors.text },
};

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts({
    [fonts.serif]: InstrumentSerif_400Regular,
    [fonts.serifItalic]: InstrumentSerif_400Regular_Italic,
    [fonts.sans]: Geist_400Regular,
    [fonts.sansMedium]: Geist_500Medium,
    [fonts.sansSemiBold]: Geist_600SemiBold,
    [fonts.sansBold]: Geist_700Bold,
  });
  const hydrated = useAuraly((s) => s.hydrated);
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <View style={styles.page}>
        <View style={[styles.app, Platform.OS === 'web' && { maxWidth: appWidthFor(width) }]}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#05040D' : colors.bg,
    alignItems: 'center',
  },
  // On desktop browsers the app renders as a phone-width column; phone browsers get the full width.
  app: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
});

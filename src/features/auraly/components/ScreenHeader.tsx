import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, sans, serif } from '../theme';
import { Icon } from './Icon';

/** Top bar for pushed screens: glass back button + optional centered title. */
export function ScreenHeader({ title, onBack }: { title?: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 12 }]}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={6}
        style={({ pressed }) => [styles.back, { opacity: pressed ? 0.8 : 1 }]}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        {/* Wrapped so it paints above the absolute blur layer on web. */}
        <View>
          <Icon name="back" size={18} color={colors.white} />
        </View>
      </Pressable>
      {title ? (
        <Text style={[sans(16, 600), styles.title]} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <View style={{ width: 40 }} />
    </View>
  );
}

/** Big serif page title + subtitle ("Readings", "Conversations"). */
export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[serif(52), { letterSpacing: -0.78 }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[sans(14.5), { color: colors.textMuted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(11,8,26,0.4)',
  },
  title: { flex: 1, textAlign: 'center' },
});

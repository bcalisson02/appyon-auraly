import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, sans } from '../../theme';
import { AuraAvatar } from '../media';
import { CircleButton, CreditsPill, Dot } from '../primitives';

interface Props {
  status: string;
  credits: number;
  hasReading: boolean;
  onBack(): void;
  onReadings(): void;
  onCreditsLongPress(): void;
}

/** Solid header so messages never show behind it. */
export function ChatHeader({ status, credits, hasReading, onBack, onReadings, onCreditsLongPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <CircleButton icon="back" size={36} label="Back" onPress={onBack} />
      <AuraAvatar size={40} glow />
      <View style={styles.title}>
        <Text style={sans(16, 600)} numberOfLines={1}>
          Master Aura
        </Text>
        <View style={styles.status} accessibilityLiveRegion="polite">
          <Dot color={colors.success} />
          <Text style={[sans(12), { color: colors.textMeta }]} numberOfLines={1}>
            {status}
          </Text>
        </View>
      </View>
      <CreditsPill credits={credits} onLongPress={onCreditsLongPress} />
      <CircleButton icon="grid" label="Readings" onPress={onReadings} badge={hasReading} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.bg,
  },
  title: { flex: 1, minWidth: 0, gap: 2 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

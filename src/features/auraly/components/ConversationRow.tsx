import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, sans } from '../theme';
import { Thumb } from './media';

interface Props {
  title: string;
  date: string;
  preview: string;
  meta: string;
  art: number;
  artFocus?: number;
  /** The live Love Palm thread: lavender border + green meta. */
  current?: boolean;
  onPress: () => void;
}

export function ConversationRow({ title, date, preview, meta, art, artFocus = 0.5, current, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${date}. ${preview}`}
      style={({ pressed }) => [styles.row, current && styles.current, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Thumb source={art} size={56} radius={radii.thumbMd} y={artFocus} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[sans(14.5, 600), { flex: 1 }]} numberOfLines={1}>
            {title}
          </Text>
          {date ? <Text style={[sans(11.5), { color: colors.textFaint }]}>{date}</Text> : null}
        </View>
        <Text style={[sans(13, 400, 1.45), { color: colors.textMuted }]} numberOfLines={2}>
          {preview}
        </Text>
        <Text style={[sans(11.5, 600), { color: current ? colors.success : colors.textFaint }]}>{meta}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 12,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glassTile,
  },
  current: { borderColor: 'rgba(215,200,255,0.28)' },
  body: { flex: 1, minWidth: 0, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

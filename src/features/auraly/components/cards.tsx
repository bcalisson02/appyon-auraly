/** Card and tile layouts used across Home, Full reading and Readings. */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sans, shadows } from '../theme';
import { Icon } from './Icon';
import { CoverImage } from './primitives';

/** Feature card shell: radius 30, surface bg, hairline border, deep shadow. */
export function FeatureCard({
  children,
  onPress,
  bg = colors.surface,
  shadow = true,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  bg?: string;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const body = <View style={[styles.featureInner, { backgroundColor: bg }]}>{children}</View>;
  const outer = [styles.feature, shadow && shadows.card, style];
  if (!onPress) return <View style={outer}>{body}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [outer, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      {body}
    </Pressable>
  );
}

/** 2-column image tile (radius 28, inner image radius 21). */
export function Tile({
  title,
  subtitle,
  source,
  y = 0.5,
  imageHeight,
  onPress,
  dimmed,
}: {
  title: string;
  subtitle: string;
  source: number;
  y?: number;
  imageHeight: number;
  onPress: () => void;
  dimmed?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.tile, { opacity: dimmed ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <View style={[styles.tileImage, { height: imageHeight }]}>
        <CoverImage source={source} y={y} />
        <View style={[StyleSheet.absoluteFill, styles.tileRing]} />
      </View>
      <View style={styles.tileText}>
        <Text style={sans(14.5, 600)} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[sans(12), { color: colors.textFaint }]} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

/** Horizontal row card (radius 24) with leading media, text and trailing slot. */
export function RowCard({
  leading,
  title,
  subtitle,
  trailing = 'chevron',
  onPress,
  dashed,
}: {
  leading?: ReactNode;
  title: string;
  subtitle: string;
  trailing?: ReactNode | 'chevron';
  onPress?: () => void;
  dashed?: boolean;
}) {
  const content = (
    <>
      {leading}
      <View style={styles.rowText}>
        <Text style={sans(14.5, 600)} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[sans(12.5, 400, 1.5), { color: colors.textFaint }]}>{subtitle}</Text>
      </View>
      {trailing === 'chevron' ? <Icon name="chev" size={18} color={colors.textFaint} /> : trailing}
    </>
  );
  const style = [styles.row, dashed && styles.rowDashed];
  if (!onPress) return <View style={style}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [style, { opacity: pressed ? 0.85 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  feature: { borderRadius: radii.card },
  featureInner: {
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  grid: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.tile,
    padding: 8,
    paddingBottom: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glassTile,
  },
  tileImage: { borderRadius: radii.thumbLg, overflow: 'hidden' },
  tileRing: { borderRadius: radii.thumbLg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  tileText: { gap: 3, paddingHorizontal: 6 },
  row: {
    borderRadius: radii.row,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.glassTile,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowDashed: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 16 },
  rowText: { flex: 1, minWidth: 0, gap: 3 },
});

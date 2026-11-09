/**
 * Small building blocks shared by every Auraly screen:
 * Pill, CircleButton, CreditsPill, SerifTitle, GlassTag, Dot, CroppedImage.
 */
import { BlurView } from 'expo-blur';
import { Image, type ImageContentPosition } from 'expo-image';
import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii, sans, serif } from '../theme';
import { Icon, type IconName } from './Icon';

/* ---------- Pill ---------- */

export type PillVariant = 'primary' | 'success' | 'glass' | 'ghost';
type PillSize = 'sm' | 'md' | 'lg';

interface PillProps {
  label: string;
  onPress?: () => void;
  onLongPress?: () => void;
  variant?: PillVariant;
  size?: PillSize;
  icon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
  /** Inert pills (e.g. "Unlocked ✓") keep full opacity but ignore taps. */
  inert?: boolean;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

const pillPalette: Record<PillVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.white, fg: colors.ink, border: 'transparent' },
  success: { bg: colors.successBg, fg: colors.success, border: 'transparent' },
  glass: { bg: colors.chipGlass, fg: colors.textSoft, border: colors.borderStrong },
  ghost: { bg: 'transparent', fg: colors.textSoft, border: 'rgba(255,255,255,0.18)' },
};

const pillSize: Record<PillSize, { py: number; px: number; font: number; icon: number }> = {
  sm: { py: 9, px: 13, font: 12.5, icon: 14 },
  md: { py: 12, px: 17, font: 14, icon: 16 },
  lg: { py: 14, px: 21, font: 14.5, icon: 16 },
};

/** Primary = white pill with ink text. Secondary = glass pill. */
export function Pill({
  label,
  onPress,
  onLongPress,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  disabled,
  inert,
  block,
  style,
  accessibilityHint,
}: PillProps) {
  const p = pillPalette[variant];
  const s = pillSize[size];
  return (
    <Pressable
      onPress={inert || disabled ? undefined : onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!inert }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: p.bg,
          borderColor: p.border,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          alignSelf: block ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.4 : pressed && !inert ? 0.85 : 1,
          transform: [{ scale: pressed && !inert && !disabled ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={s.icon + 2} color={p.fg} strokeWidth={2} /> : null}
      <Text style={[sans(s.font, 600), { color: p.fg }]} numberOfLines={1}>
        {label}
      </Text>
      {trailingIcon ? <Icon name={trailingIcon} size={s.icon} color={p.fg} strokeWidth={trailingIcon === 'check' ? 2.6 : 2.2} /> : null}
    </Pressable>
  );
}

/* ---------- CircleButton ---------- */

interface CircleButtonProps {
  icon: IconName;
  onPress: () => void;
  size?: number;
  variant?: 'chip' | 'glass';
  label: string;
  badge?: boolean;
}

export function CircleButton({ icon, onPress, size = 40, variant = 'chip', label, badge }: CircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: variant === 'chip' ? colors.chip : colors.glassStrong,
          borderColor: variant === 'chip' ? colors.borderChip : colors.borderStrong,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Icon name={icon} size={icon === 'grid' ? 16 : 18} color={colors.white} strokeWidth={icon === 'grid' ? 1.8 : 2} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

/* ---------- CreditsPill ---------- */

export function CreditsPill({ credits, onLongPress }: { credits: number; onLongPress?: () => void }) {
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={600}
      accessibilityLabel={`${credits} credits`}
      accessibilityHint={onLongPress ? 'Long press for demo controls' : undefined}
      style={styles.credits}
    >
      <Dot color={colors.gold} size={7} glow />
      <Text style={sans(13, 600)}>{credits}</Text>
    </Pressable>
  );
}

/* ---------- Dot ---------- */

export function Dot({ color, size = 6, glow }: { color: string; size?: number; glow?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        ...(glow ? { shadowColor: color, shadowOpacity: 1, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } } : null),
      }}
    />
  );
}

/* ---------- SerifTitle ---------- */

interface SerifTitleProps {
  size: number;
  /** Text before the italic accent. */
  children?: ReactNode;
  accent?: string;
  accentColor?: string;
  after?: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

/** Instrument Serif headline with an optional italic accent word ("Hello, *Sofia*"). */
export function SerifTitle({
  size,
  children,
  accent,
  accentColor = colors.lavender,
  after,
  lineHeight,
  style,
  numberOfLines,
}: SerifTitleProps) {
  return (
    <Text style={[serif(size, lineHeight), style]} numberOfLines={numberOfLines} accessibilityRole="header">
      {children}
      {accent ? <Text style={{ fontFamily: fonts.serifItalic, color: accentColor }}>{accent}</Text> : null}
      {after}
    </Text>
  );
}

/* ---------- GlassTag ("New reading", "I of IV") ---------- */

export function GlassTag({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.tag, style]}>
      {/* Rounded itself: Chrome doesn't clip backdrop-filter to the parent's radius. */}
      <BlurView intensity={24} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: radii.pill }]} />
      <View style={styles.tagInner}>{children}</View>
    </View>
  );
}

export function RomanBadge({ roman, style }: { roman: string; style?: StyleProp<ViewStyle> }) {
  return (
    <GlassTag style={[{ left: 16, top: 14, borderColor: 'rgba(255,255,255,0.14)' }, style]}>
      <Text style={serif(22)}>{roman}</Text>
      <Text style={[sans(11.5), { color: 'rgba(255,255,255,0.75)' }]}>of IV</Text>
    </GlassTag>
  );
}

/* ---------- CroppedImage ---------- */

interface CroppedImageProps {
  source: number;
  /** Intrinsic width / height of the asset. */
  aspect: number;
  /** Image width relative to the container (CSS `background-size: N% auto`). */
  scale: number;
  /** Background-position percentages (0..1). */
  x?: number;
  y?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Zoomed crop of an image, equivalent to CSS `background: url() x% y% / scale% auto`.
 * Used for the Master Aura avatar and portraits, which zoom into her face.
 */
export function CroppedImage({ source, aspect, scale, x = 0.5, y = 0.5, style }: CroppedImageProps) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (!box || box.w !== w || box.h !== h) setBox({ w, h });
  };
  let imgStyle: ImageStyle | undefined;
  if (box) {
    const w = box.w * scale;
    const h = w / aspect;
    imgStyle = { position: 'absolute', width: w, height: h, left: (box.w - w) * x, top: (box.h - h) * y };
  }
  return (
    <View style={[{ overflow: 'hidden' }, style]} onLayout={onLayout}>
      {imgStyle ? <Image source={source} style={imgStyle} contentFit="fill" transition={0} /> : null}
    </View>
  );
}

/** Cover image with a CSS-like vertical focus (background-position 50% y%). */
export function CoverImage({ source, y = 0.5, style }: { source: number; y?: number; style?: StyleProp<ImageStyle> }) {
  const position: ImageContentPosition = { left: '50%', top: `${Math.round(y * 100)}%` };
  return (
    <Image
      source={source}
      style={[{ width: '100%', height: '100%' }, style]}
      contentFit="cover"
      contentPosition={position}
      transition={150}
    />
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  badge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.pink,
  },
  credits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.borderChip,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
  tag: {
    position: 'absolute',
    left: 14,
    top: 14,
    borderRadius: radii.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(11,8,26,0.4)',
  },
  tagInner: { flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingVertical: 6, paddingHorizontal: 11 },
});

/**
 * Auraly design tokens (from the Love Palm handoff README → "Design tokens").
 * Every screen and component reads from here; no raw hex values elsewhere.
 */
import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#0B081A',
  bgScan: '#07051A',
  surface: '#140F27',
  surfaceDeep: '#0A0B33',
  chip: '#1A1433',
  glass: 'rgba(255,255,255,0.06)',
  glassTile: 'rgba(255,255,255,0.05)',
  glassStrong: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderCard: 'rgba(255,255,255,0.09)',
  borderChip: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.12)',
  hairline: 'rgba(255,255,255,0.08)',

  text: '#F4F1FF',
  textSoft: '#EEE9FF',
  textMuted: '#B4ACD6',
  textFaint: '#8F86B3',
  textMeta: '#A79FC7',

  lavender: '#D7C8FF',
  lavenderGlow: '#C9B8FF',
  pink: '#F2B8E6',
  gold: '#F3D19C',
  success: '#7FE0B0',
  successBg: 'rgba(127,224,176,0.14)',
  userBubble: '#E6DDFF',
  ink: '#160F2E',
  white: '#FFFFFF',
  auraAvatarBg: '#2B1D6B',

  composerGlass: 'rgba(20,15,39,0.6)',
  chipGlass: 'rgba(20,15,39,0.55)',
  toastBg: 'rgba(244,241,255,0.96)',
  tabBarBg: 'rgba(26,20,51,0.8)',
} as const;

export const lineColors = {
  heart: '#EE6FC4',
  head: '#B98CFF',
  life: '#F8C84A',
  fate: '#8FD8FF',
} as const;

export const radii = {
  pill: 999,
  card: 30,
  tile: 28,
  row: 24,
  bubble: 22,
  bubbleTail: 6,
  thumbLg: 21,
  question: 18,
  thumbMd: 17,
  thumbSm: 16,
  label: 13,
} as const;

export const fonts = {
  serif: 'InstrumentSerif',
  serifItalic: 'InstrumentSerif-Italic',
  sans: 'Geist',
  sansMedium: 'Geist-Medium',
  sansSemiBold: 'Geist-SemiBold',
  sansBold: 'Geist-Bold',
} as const;

/** Display serif. Line-height 1 (0.98 at 46), letter-spacing −0.01em on ≥34. */
export function serif(size: number, lineHeight = 1): TextStyle {
  return {
    fontFamily: fonts.serif,
    fontSize: size,
    lineHeight: Math.round(size * lineHeight),
    letterSpacing: size >= 34 ? -0.01 * size : 0,
    color: colors.text,
  };
}

type Weight = 400 | 500 | 600 | 700;
const sansFamily: Record<Weight, string> = {
  400: fonts.sans,
  500: fonts.sansMedium,
  600: fonts.sansSemiBold,
  700: fonts.sansBold,
};

/** UI sans (Geist). Each weight is its own loaded family, so no fontWeight is needed. */
export function sans(size: number, weight: Weight = 400, lineHeight?: number): TextStyle {
  return {
    fontFamily: sansFamily[weight],
    fontSize: size,
    ...(lineHeight ? { lineHeight: Math.round(size * lineHeight) } : null),
    letterSpacing: -0.005 * size,
    color: colors.text,
  };
}

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 30 },
    elevation: 12,
  },
  glow: {
    shadowColor: '#7A50FF',
    shadowOpacity: 0.5,
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 30 },
    elevation: 16,
  },
  toast: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 17,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
} as const;

export const layout = {
  /** Web column = the design's target frame (390×844 pt, iPhone 14/15). */
  maxWidth: 390,
  screenPadding: 16,
  tabBarHeight: 66,
  tabBarBottom: 24,
} as const;

/**
 * Image compositions: faded art headers, Master Aura avatar/portrait,
 * arch-shaped archetype art and screen backgrounds.
 */
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { img } from '../assets';
import { colors } from '../theme';
import { CoverImage, CroppedImage } from './primitives';

const AURA_ASPECT = 1122 / 1402;

/** Art header whose bottom fades into the card surface (mask 50% → 100%). */
export function FadeImageHeader({
  source,
  height,
  y = 0.5,
  fadeTo = colors.surface,
  topShade = 0,
  children,
}: {
  source: number;
  height: number;
  y?: number;
  fadeTo?: string;
  /** Extra darkening at the very top (line cards use .15). */
  topShade?: number;
  children?: ReactNode;
}) {
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <CoverImage source={source} y={y} />
      <LinearGradient
        colors={[`rgba(11,8,26,${topShade})`, 'rgba(0,0,0,0)', fadeTo]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

/** Round Master Aura avatar zoomed on her face, with ring (+ optional glow). */
export function AuraAvatar({ size, glow }: { size: number; glow?: boolean }) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        glow && { shadowColor: colors.lavenderGlow, shadowOpacity: 0.35, shadowRadius: 9, shadowOffset: { width: 0, height: 0 } },
      ]}
    >
      <CroppedImage
        source={img.masterAura}
        aspect={AURA_ASPECT}
        scale={2.5}
        x={0.5}
        y={0.33}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.auraAvatarBg,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.22)',
        }}
      />
    </View>
  );
}

/** Arch-shaped portrait (rounded top) with ring and violet glow. */
export function ArchFrame({
  width,
  height,
  children,
  style,
}: {
  width: number;
  height: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const top = width / 2;
  const bottom = Math.round(width * 0.12);
  const shape = {
    borderTopLeftRadius: top,
    borderTopRightRadius: top,
    borderBottomLeftRadius: bottom,
    borderBottomRightRadius: bottom,
  };
  return (
    <View
      style={[
        { padding: 7, backgroundColor: 'rgba(201,184,255,0.06)', ...shape, borderTopLeftRadius: top + 7, borderTopRightRadius: top + 7 },
        style,
      ]}
    >
      <View
        style={[
          {
            width,
            height,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            backgroundColor: colors.auraAvatarBg,
            shadowColor: '#7A50FF',
            shadowOpacity: 0.5,
            shadowRadius: 35,
            shadowOffset: { width: 0, height: 26 },
          },
          shape,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function AuraPortrait({ width = 124, height = 156 }: { width?: number; height?: number }) {
  return (
    <ArchFrame width={width} height={height}>
      <CroppedImage source={img.masterAura} aspect={AURA_ASPECT} scale={1.65} x={0.5} y={0.26} style={StyleSheet.absoluteFill} />
    </ArchFrame>
  );
}

export function ArchetypeArt({ width, height }: { width: number; height: number }) {
  return (
    <ArchFrame width={width} height={height}>
      <CoverImage source={img.devotedFlame} y={0.55} />
    </ArchFrame>
  );
}

/** Top-of-screen illustrated background (bg-swirl), faded into the app background. */
export function HeaderBackdrop({
  source = img.bgSwirl,
  height,
  opacity,
  y = 0.2,
  stops = [0.55, 0.15],
}: {
  source?: number;
  height: number;
  opacity: number;
  y?: number;
  stops?: [number, number];
}) {
  return (
    <View pointerEvents="none" style={[styles.backdrop, { height }]}>
      <CoverImage source={source} y={y} style={{ opacity }} />
      <LinearGradient
        colors={[`rgba(11,8,26,${stops[0]})`, `rgba(11,8,26,${stops[1]})`, colors.bg]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/** Small square thumbnail (52/56 pt) used in list rows. */
export function Thumb({ source, size = 52, radius = 16, y = 0.5 }: { source: number; size?: number; radius?: number; y?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }}>
      <CoverImage source={source} y={y} />
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', left: 0, right: 0, top: 0 },
});

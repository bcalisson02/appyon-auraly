/** Visual pieces of the palm scan: guide outline, scan beam, glow, shutter, status badge. */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { HAND_OUTLINE, VIEWBOX, type Hand } from '../../data/lines';
import { colors, radii, sans } from '../../theme';
import { Icon } from '../Icon';
import { Dot } from '../primitives';

export type ScanPhase = 'idle' | 'aligned' | 'run' | 'done' | 'failed';

/* ---------- radial glow (CSS radial-gradient equivalent) ---------- */

export function RadialGlow({
  size,
  color,
  opacity,
  stop = 0.65,
  style,
}: {
  size: number;
  color: string;
  opacity: number;
  stop?: number;
  style?: object;
}) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset={stop} stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill="url(#glow)" />
      </Svg>
    </View>
  );
}

/* ---------- hand guide outline ---------- */

const pulse = {
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
};

/** Dotted lavender outline while aligning; solid white once aligned; fades out when scanning. */
export function HandGuide({ width, height, hand, phase }: { width: number; height: number; hand: Hand; phase: ScanPhase }) {
  const reduce = useReducedMotion();
  const waiting = phase === 'idle' || phase === 'failed';
  const visible = waiting || phase === 'aligned';
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 800 });
  }, [visible, opacity]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, fade, hand === 'left' && { transform: [{ scaleX: -1 }] }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          waiting && !reduce
            ? {
                animationName: pulse,
                animationDuration: '1.8s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
              }
            : null,
        ]}
      >
        <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}>
          <Path
            d={HAND_OUTLINE}
            fill={waiting ? 'rgba(201,184,255,0.05)' : 'transparent'}
            stroke={waiting ? colors.lavenderGlow : '#fff'}
            strokeWidth={5}
            strokeOpacity={0.35}
          />
          <Path
            d={HAND_OUTLINE}
            fill="none"
            stroke={waiting ? colors.lavender : '#fff'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={waiting ? [0.1, 7] : undefined}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/* ---------- scan beam ---------- */

/** Thin white line with lavender glow and soft trail, sweeping top → bottom (2.6 s loop). */
export function ScanBeam({ height }: { height: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const band = Math.round(height * 0.18);
  const sweep = {
    '0%': { transform: [{ translateY: -band }], opacity: 0 },
    '12%': { opacity: 1 },
    '88%': { opacity: 1 },
    '100%': { transform: [{ translateY: height }], opacity: 0 },
  };
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.beam,
        { height: band },
        {
          animationName: sweep,
          animationDuration: '2.6s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(201,184,255,0)', 'rgba(201,184,255,0.07)', 'rgba(215,200,255,0.22)', 'rgba(255,255,255,0)']}
        locations={[0, 0.7, 0.97, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', '#fff', '#fff', 'rgba(255,255,255,0)']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.beamLine}
      />
    </Animated.View>
  );
}

/* ---------- shutter ---------- */

export function Shutter({ enabled, onPress, onLongPress }: { enabled: boolean; onPress(): void; onLongPress(): void }) {
  const opacity = useSharedValue(enabled ? 1 : 0.35);
  useEffect(() => {
    opacity.value = withTiming(enabled ? 1 : 0.35, { duration: 400 });
  }, [enabled, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={style}>
      <Pressable
        onPress={enabled ? onPress : undefined}
        onLongPress={onLongPress}
        delayLongPress={700}
        accessibilityRole="button"
        accessibilityLabel="Scan palm"
        accessibilityHint="Long press to simulate a hand that is not detected"
        accessibilityState={{ disabled: !enabled }}
        style={({ pressed }) => [styles.shutter, { transform: [{ scale: pressed && enabled ? 0.94 : 1 }] }]}
      >
        <View style={styles.shutterInner} />
      </Pressable>
    </Animated.View>
  );
}

/* ---------- status badge ---------- */

const BADGE: Record<ScanPhase, string> = {
  idle: 'Align your hand',
  failed: 'Align your hand',
  aligned: 'Hand aligned',
  run: 'Scanning',
  done: 'Completed',
};

export function ScanBadge({ phase }: { phase: ScanPhase }) {
  const ok = phase === 'aligned' || phase === 'done';
  return (
    <View style={styles.badge} accessibilityLiveRegion="polite">
      {ok ? (
        <Icon name="check" size={13} color={colors.success} strokeWidth={2.8} />
      ) : (
        <Dot color={phase === 'run' ? colors.pink : colors.textFaint} size={7} />
      )}
      <Text style={sans(12, 600)} numberOfLines={1}>
        {BADGE[phase]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  beam: { position: 'absolute', left: 0, right: 0, top: 0 },
  beamLine: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    bottom: 2,
    height: 1.5,
    borderRadius: 2,
    shadowColor: '#C9B8FF',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: 5,
  },
  shutterInner: { flex: 1, borderRadius: 33, backgroundColor: '#fff' },
  badge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
  },
});

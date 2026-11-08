/**
 * Palm photo with the four traced love lines and (optionally) labeled leaders.
 * Used by the scan (animated drawing), the chat thumbnail and the Full reading
 * (tap a label to select a line). Geometry is in the 300×400 viewBox of palm.png;
 * the left hand mirrors photo + lines, while labels use mirrored anchors so text
 * stays readable.
 */
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { img } from '../assets';
import { labelFor, LINE_IDS, lineById, PATH_LENGTH, PATHS, VIEWBOX, type Hand, type LineId } from '../data/lines';
import { colors, radii, sans } from '../theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const DRAW_EASING = Easing.bezier(0.45, 0, 0.2, 1);
const LABEL_W = 92;
const LABEL_H = 26;

export type DrawState = Partial<Record<LineId, boolean>>;

interface PalmViewProps {
  width: number;
  hand: Hand;
  /** Which lines are drawn. Lines switching false → true animate in. */
  drawn?: DrawState;
  /** Duration of a single line drawing, ms. */
  drawDuration?: number;
  /** Show leader + label pill for drawn lines (fades in after the line is drawn). */
  labels?: boolean;
  selected?: LineId | null;
  onSelect?: (id: LineId) => void;
  radius?: number;
  /** Darkening gradient over the photo. */
  shade?: boolean;
  /** Extra layer above lines (scan beam). */
  overlay?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ALL_DRAWN: DrawState = { heart: true, head: true, life: true, fate: true };

export function PalmView({
  width,
  hand,
  drawn = ALL_DRAWN,
  drawDuration = 2600,
  labels = false,
  selected = null,
  onSelect,
  radius = radii.card,
  shade = true,
  overlay,
  style,
}: PalmViewProps) {
  const height = Math.round((width * VIEWBOX.h) / VIEWBOX.w);
  const mirror = hand === 'left';

  return (
    <View style={[{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: '#0b0b0c' }, style]}>
      <View style={[StyleSheet.absoluteFill, mirror && { transform: [{ scaleX: -1 }] }]}>
        <Image source={img.palm} style={StyleSheet.absoluteFill} contentFit="cover" transition={0} />
        {shade ? (
          <LinearGradient
            colors={['rgba(11,8,26,0.2)', 'rgba(11,8,26,0.05)', 'rgba(11,8,26,0.35)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} style={StyleSheet.absoluteFill}>
          {LINE_IDS.map((id) => (
            <DrawnLine key={id} id={id} drawn={!!drawn[id]} duration={drawDuration} dim={!!selected && selected !== id} />
          ))}
        </Svg>
      </View>

      {labels ? (
        <Labels
          width={width}
          height={height}
          hand={hand}
          drawn={drawn}
          selected={selected}
          onSelect={onSelect}
          delay={onSelect ? 0 : drawDuration + 100}
        />
      ) : null}
      {overlay}
    </View>
  );
}

/** One traced line: soft glow stroke + crisp stroke, drawn with stroke-dashoffset. */
function DrawnLine({ id, drawn, duration, dim }: { id: LineId; drawn: boolean; duration: number; dim: boolean }) {
  const reduce = useReducedMotion();
  const len = PATH_LENGTH[id];
  const progress = useSharedValue(drawn ? 1 : 0);
  const opacity = useSharedValue(dim ? 0.16 : 1);

  useEffect(() => {
    progress.value = drawn ? (reduce ? 1 : withTiming(1, { duration, easing: DRAW_EASING })) : 0;
  }, [drawn, duration, reduce, progress]);

  useEffect(() => {
    opacity.value = withTiming(dim ? 0.16 : 1, { duration: 400 });
  }, [dim, opacity]);

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: len * (1 - progress.value),
    strokeOpacity: opacity.value,
  }));
  const glowProps = useAnimatedProps(() => ({
    strokeDashoffset: len * (1 - progress.value),
    strokeOpacity: opacity.value * 0.4,
  }));
  const haloProps = useAnimatedProps(() => ({
    strokeDashoffset: len * (1 - progress.value),
    strokeOpacity: opacity.value * 0.15,
  }));

  const color = lineById(id).color;
  const common = { d: PATHS[id], stroke: color, fill: 'none', strokeLinecap: 'round' as const, strokeDasharray: [len, len] };
  return (
    <G>
      <AnimatedPath {...common} strokeWidth={11} animatedProps={haloProps} />
      <AnimatedPath {...common} strokeWidth={6} animatedProps={glowProps} />
      <AnimatedPath {...common} strokeWidth={2.4} animatedProps={lineProps} />
    </G>
  );
}

/** Leader curves + white label pills. */
function Labels({
  width,
  height,
  hand,
  drawn,
  selected,
  onSelect,
  delay,
}: {
  width: number;
  height: number;
  hand: Hand;
  drawn: DrawState;
  selected: LineId | null;
  onSelect?: (id: LineId) => void;
  delay: number;
}) {
  const k = width / VIEWBOX.w;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {LINE_IDS.filter((id) => drawn[id]).map((id) => (
        <Label key={id} id={id} k={k} width={width} height={height} hand={hand} selected={selected} onSelect={onSelect} delay={delay} />
      ))}
    </View>
  );
}

function Label({
  id,
  k,
  width,
  height,
  hand,
  selected,
  onSelect,
  delay,
}: {
  id: LineId;
  k: number;
  width: number;
  height: number;
  hand: Hand;
  selected: LineId | null;
  onSelect?: (id: LineId) => void;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const L = labelFor(id, hand);
  const on = !selected || selected === id;
  const active = selected === id;
  const appear = useSharedValue(reduce || delay === 0 ? 1 : 0);

  useEffect(() => {
    if (!reduce && delay > 0) appear.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, [appear, delay, reduce]);

  const groupStyle = useAnimatedStyle(() => ({
    opacity: appear.value * (on ? 1 : 0.45),
    transform: [{ translateY: (1 - appear.value) * 4 }],
  }));

  const sx = L.side === 'l' ? L.lx + LABEL_W / k : L.lx - LABEL_W / k;
  const mx = (sx + L.ax) / 2;
  const pillPos = L.side === 'l' ? { left: L.lx * k } : { right: width - L.lx * k };
  const white = active || !selected;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, groupStyle]} pointerEvents="box-none">
      <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={`M${sx} ${L.ly} C${mx} ${L.ly} ${mx} ${L.ay} ${L.ax} ${L.ay}`}
          stroke="#fff"
          strokeWidth={1.1 / k}
          fill="none"
          opacity={0.85}
        />
        <Circle cx={L.ax} cy={L.ay} r={3.4 / k} fill="#fff" />
        <Circle cx={L.ax} cy={L.ay} r={7 / k} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={1 / k} />
      </Svg>
      <Pressable
        disabled={!onSelect}
        onPress={() => onSelect?.(id)}
        accessibilityRole={onSelect ? 'button' : 'text'}
        accessibilityState={{ selected: active }}
        hitSlop={6}
        style={[
          styles.pill,
          pillPos,
          { top: L.ly * k - LABEL_H / 2 },
          white ? styles.pillWhite : styles.pillDark,
          active && styles.pillActive,
        ]}
      >
        <Text style={[sans(12, 600), { color: white ? colors.ink : colors.white }]} numberOfLines={1}>
          {lineById(id).name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    width: LABEL_W,
    height: LABEL_H,
    borderRadius: radii.label,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillWhite: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
  },
  pillDark: { backgroundColor: 'rgba(40,30,70,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
  pillActive: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)' },
});

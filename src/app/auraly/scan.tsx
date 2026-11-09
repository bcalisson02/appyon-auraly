import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { img } from '@/features/auraly/assets';
import { PalmView, type DrawState } from '@/features/auraly/components/PalmView';
import { CircleButton, Pill, SerifTitle } from '@/features/auraly/components/primitives';
import { HandGuide, RadialGlow, ScanBadge, ScanBeam, Shutter, type ScanPhase } from '@/features/auraly/components/scan/ScanParts';
import { LINES } from '@/features/auraly/data/lines';
import { nav } from '@/features/auraly/navigation';
import { useAuraly } from '@/features/auraly/store';
import { colors, appWidthFor, sans, serif } from '@/features/auraly/theme';

/* ---------- local state machine ---------- */

const STEP_MS = 1700;
const LAST_STEP = 6; // 0: finding palm, 1: …, 2–5: heart/head/life/fate, 6 → done
const ALIGN_MS = 2000;
const NOT_DETECTED_MS = 6000;

interface ScanState {
  phase: ScanPhase;
  step: number;
  /** 'notDetected' simulates a hand the camera cannot see (demo / long-press). */
  mode: 'normal' | 'notDetected';
}

type ScanAction =
  { type: 'align' } | { type: 'fail' } | { type: 'capture' } | { type: 'tick' } | { type: 'retry'; mode: ScanState['mode'] };

function reducer(s: ScanState, a: ScanAction): ScanState {
  switch (a.type) {
    case 'align':
      return s.phase === 'idle' ? { ...s, phase: 'aligned' } : s;
    case 'fail':
      return s.phase === 'idle' ? { ...s, phase: 'failed' } : s;
    case 'capture':
      return s.phase === 'aligned' ? { ...s, phase: 'run', step: 0 } : s;
    case 'tick':
      if (s.phase !== 'run') return s;
      return s.step >= LAST_STEP ? { ...s, phase: 'done' } : { ...s, step: s.step + 1 };
    case 'retry':
      return { phase: 'idle', step: 0, mode: a.mode };
  }
}

/** Lines drawn so far: each line appears at its own step (heart at 2 … fate at 5). */
function drawnAt(step: number, phase: ScanPhase): DrawState {
  const d: DrawState = {};
  LINES.forEach((l, i) => {
    d[l.id] = phase === 'done' || (phase === 'run' && step >= i + 2);
  });
  return d;
}

/* ---------- screen ---------- */

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const dims = useWindowDimensions();
  const reduce = useReducedMotion();
  const hand = useAuraly((s) => s.hand);
  const notDetectedDemo = useAuraly((s) => s.demo.handNotDetected);
  const sendScanToAura = useAuraly((s) => s.sendScanToAura);

  // Only reachable from the camera step; a direct URL in any other stage goes to the chat.
  const [allowed] = useState(() => useAuraly.getState().stage === 'camera');
  const [scan, dispatch] = useReducer(reducer, { phase: 'idle', step: 0, mode: notDetectedDemo ? 'notDetected' : 'normal' });
  const { phase, step, mode } = scan;

  // Simulated hand detection.
  useEffect(() => {
    if (phase !== 'idle') return;
    const t = setTimeout(() => dispatch({ type: mode === 'normal' ? 'align' : 'fail' }), mode === 'normal' ? ALIGN_MS : NOT_DETECTED_MS);
    return () => clearTimeout(t);
  }, [phase, mode]);

  // Scanning progress.
  useEffect(() => {
    if (phase !== 'run') return;
    const t = setInterval(() => dispatch({ type: 'tick' }), STEP_MS);
    return () => clearInterval(t);
  }, [phase]);

  // Viewfinder: 3:4, max 340, fits narrow and short screens.
  const appWidth = appWidthFor(dims.width);
  const byHeight = ((dims.height - insets.top - insets.bottom - 300) * 3) / 4;
  const vw = Math.round(Math.max(220, Math.min(340, appWidth - 40, byHeight)));
  const vh = Math.round((vw * 4) / 3);

  // Photo eases into place once aligned (1.1 s, cubic-bezier(.2,.8,.2,1)).
  const settled = phase !== 'idle' && phase !== 'failed';
  const settle = useSharedValue(settled ? 1 : 0);
  useEffect(() => {
    settle.value = reduce ? (settled ? 1 : 0) : withTiming(settled ? 1 : 0, { duration: 1100, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  }, [settled, reduce, settle]);
  const photoStyle = useAnimatedStyle(() => {
    const k = 1 - settle.value;
    return {
      transform: [{ translateX: -26 * k }, { translateY: 48 * k }, { rotate: `${7 * k}deg` }, { scale: 1 + 0.06 * k }],
    };
  });
  const blurStyle = useAnimatedStyle(() => ({ opacity: 1 - settle.value }));

  if (!allowed) return <Redirect href="/auraly/chat" />;

  const close = () => nav.back(nav.chat);
  const send = () => {
    sendScanToAura();
    close();
  };

  const waiting = phase === 'idle' || phase === 'failed' || phase === 'aligned';
  const hint =
    phase === 'failed'
      ? "I can't see your whole hand. Move back a little and open your fingers."
      : phase === 'aligned'
        ? 'Perfect. Hold still and tap to scan.'
        : `Place your ${hand} hand inside the outline, fingers relaxed.`;
  const pct = `${Math.round((Math.min(step, LAST_STEP) / LAST_STEP) * 100)}%`;
  const stepLabel = step <= 1 ? 'Finding your palm' : `Tracing your ${LINES[Math.min(3, step - 2)].name.toLowerCase()}`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 16) + 14 }]}>
      <RadialGlow size={520} color="#7A60FF" opacity={0.42} style={{ left: appWidth / 2 - 260, top: insets.top + 60 }} />

      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <CircleButton icon="close" variant="glass" label="Close scan" onPress={close} />
        </View>
        <Text style={sans(16, 600)} numberOfLines={1} accessibilityRole="header">
          Palm scan
        </Text>
        <View style={{ flex: 1 }}>
          <ScanBadge phase={phase} />
        </View>
      </View>

      <View style={[styles.viewfinder, { width: vw, height: vh }]}>
        <View style={styles.viewfinderClip}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#100B22' }]} />
          <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
            <PalmView
              width={vw}
              hand={hand}
              drawn={drawnAt(step, phase)}
              drawDuration={2600}
              labels
              overlay={phase === 'run' ? <ScanBeam height={vh} /> : null}
            />
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, blurStyle, hand === 'left' && { transform: [{ scaleX: -1 }] }]}
            >
              <Image source={img.palm} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={9} transition={0} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(7,5,26,0.5)' }]} />
            </Animated.View>
          </Animated.View>
          <HandGuide width={vw} height={vh} hand={hand} phase={phase} />
        </View>
      </View>

      {waiting ? (
        <>
          <Text style={styles.hint} accessibilityLiveRegion="polite">
            {hint}
          </Text>
          {phase === 'failed' ? (
            <Pill
              label="Try again"
              variant="glass"
              onPress={() => dispatch({ type: 'retry', mode: 'normal' })}
              style={{ alignSelf: 'center' }}
            />
          ) : null}
          <View style={{ flex: 1 }} />
          <Shutter
            enabled={phase === 'aligned'}
            onPress={() => dispatch({ type: 'capture' })}
            onLongPress={() => dispatch({ type: 'retry', mode: 'notDetected' })}
          />
        </>
      ) : null}

      {phase === 'run' ? (
        <View style={styles.progress} accessibilityLiveRegion="polite">
          <Text style={serif(64)}>{pct}</Text>
          <Text style={[sans(13.5), { color: colors.textMuted }]}>{stepLabel}</Text>
        </View>
      ) : null}

      {phase === 'done' ? (
        <>
          <View style={styles.done}>
            <SerifTitle size={30} lineHeight={1.05} accent="ready" style={{ textAlign: 'center' }}>
              Your four lines are{' '}
            </SerifTitle>
            <Text style={[sans(13.5), { color: colors.textMuted, textAlign: 'center' }]}>
              Curved heart · sloping head · wide life · rising fate
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <Pill label="Send to Master Aura" size="lg" trailingIcon="arrow" block onPress={send} style={{ paddingVertical: 16 }} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScan, alignItems: 'center', paddingHorizontal: 20, gap: 16, overflow: 'hidden' },
  header: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewfinder: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#5038C8',
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 30 },
    elevation: 20,
  },
  viewfinderClip: { flex: 1, borderRadius: 29, overflow: 'hidden' },
  hint: { ...sans(14.5, 400, 1.5), color: colors.textMuted, textAlign: 'center', minHeight: 44, maxWidth: 280 },
  progress: { alignItems: 'center', gap: 6 },
  done: { alignItems: 'center', gap: 4 },
});

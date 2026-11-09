/**
 * Chat message components, one per ChatItem kind. They are presentational:
 * the screen passes state and callbacks (see ChatMessage.tsx).
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { img } from '../../assets';
import { ARCHETYPE, LINES, type Hand } from '../../data/lines';
import { PRICE } from '../../store';
import { colors, radii, sans, serif, shadows } from '../../theme';
import { FeatureCard } from '../cards';
import { ArchetypeArt, AuraPortrait, FadeImageHeader } from '../media';
import { PalmView } from '../PalmView';
import { CoverImage, GlassTag, Pill, RomanBadge, SerifTitle } from '../primitives';

/* ---------- bubbles ---------- */

export function AuraBubble({ children, text }: { children?: ReactNode; text?: string }) {
  return (
    <View style={styles.aura}>
      {text ? <Text style={styles.auraText}>{text}</Text> : null}
      {children}
    </View>
  );
}

export function UserBubble({ text }: { text: string }) {
  return (
    <View style={styles.user}>
      <Text style={styles.userText}>{text}</Text>
    </View>
  );
}

/* ---------- intro ---------- */

export function ChatIntro() {
  return (
    <View style={styles.intro}>
      <AuraPortrait />
      <SerifTitle size={40} accent="Sofia" style={{ marginTop: 6, textAlign: 'center' }}>
        Good evening,{' '}
      </SerifTitle>
      <Text style={[sans(14.5, 400, 1.5), { color: colors.textMuted, maxWidth: 280, textAlign: 'center' }]}>
        The Moon is in Pisces. A soft night to look at love.
      </Text>
    </View>
  );
}

/* ---------- offer ---------- */

const SPECS: [string, string][] = [
  ['Four love lines', 'Heart · Head · Life · Fate'],
  ['Questions with Aura', '10 included'],
  ['Saved to Readings', 'Forever'],
];

export function OfferCard({ paid, credits, onBuy }: { paid: boolean; credits: number; onBuy: () => void }) {
  return (
    <FeatureCard>
      <FadeImageHeader source={img.handsRing} height={214} y={0.42}>
        <GlassTag>
          <Text style={sans(12, 600)}>New reading</Text>
        </GlassTag>
      </FadeImageHeader>
      <View style={styles.offerBody}>
        <Text style={[sans(13, 600), { color: colors.lavender }]}>Love Palm Reading</Text>
        <SerifTitle size={36} accent="know" accentColor={colors.pink} after=" about love" style={{ marginTop: -6 }}>
          What your hands{' '}
        </SerifTitle>
        <Text style={[sans(14.5, 400, 1.55), { color: colors.textMuted }]}>
          AI traces the four lines of your palm. I read each one with you, for love.
        </Text>
        <View>
          {SPECS.map(([k, v], i) => (
            <View key={k} style={[styles.specRow, i === SPECS.length - 1 && styles.specLast]}>
              <Text style={[sans(13.5), { color: colors.textSoft }]}>{k}</Text>
              <Text style={[sans(13.5), { color: colors.textMeta, flexShrink: 1, textAlign: 'right' }]} numberOfLines={1}>
                {v}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.priceRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={serif(28)}>{PRICE.reading} credits</Text>
            <Text style={[sans(12), { color: colors.textFaint }]}>One-time · balance {credits}</Text>
          </View>
          {paid ? (
            <Pill label="Unlocked" variant="success" size="lg" trailingIcon="check" inert />
          ) : (
            <Pill label="Read my palm" size="lg" trailingIcon="arrow" onPress={onBuy} />
          )}
        </View>
      </View>
    </FeatureCard>
  );
}

/* ---------- camera ---------- */

export function CameraBubble({ text, active, onOpen }: { text: string; active: boolean; onOpen: () => void }) {
  return (
    <AuraBubble text={text}>
      <Pill label={active ? 'Open camera' : 'Scanned'} icon="camera" block inert={!active} onPress={onOpen} style={{ marginTop: 12 }} />
    </AuraBubble>
  );
}

export function CameraDeniedBubble({ active, onAllow, onSample }: { active: boolean; onAllow: () => void; onSample: () => void }) {
  return (
    <AuraBubble text="I need your camera to see your palm.">
      {active ? (
        <View style={styles.pillStack}>
          <Pill label="Allow camera" icon="camera" block onPress={onAllow} />
          <Pill label="Use a sample photo" variant="glass" block onPress={onSample} />
        </View>
      ) : null}
    </AuraBubble>
  );
}

/* ---------- credits ---------- */

export function NoCreditsBubble({
  product,
  need,
  have,
  active,
  onGetCredits,
  onLater,
}: {
  product: 'reading' | 'questions';
  need: number;
  have: number;
  active: boolean;
  onGetCredits: () => void;
  onLater: () => void;
}) {
  const text =
    product === 'reading'
      ? `You need ${need} credits for this reading. You have ${have}.`
      : `You need ${need} credits for 10 more questions. You have ${have}.`;
  return (
    <AuraBubble text={text}>
      {active ? (
        <View style={styles.pillRow}>
          <Pill label="Get credits" onPress={onGetCredits} />
          <Pill label="Maybe later" variant="ghost" onPress={onLater} />
        </View>
      ) : null}
    </AuraBubble>
  );
}

/* ---------- palm photo ---------- */

export function PhotoMessage({ hand }: { hand: Hand }) {
  return (
    <View style={styles.photo}>
      <View style={styles.photoFrame}>
        <PalmView width={150} hand={hand} radius={radii.thumbLg} />
      </View>
      <Text style={[sans(12), { color: colors.textMeta }]}>4 lines detected</Text>
    </View>
  );
}

/* ---------- line card ---------- */

export function LineCard({ index, current, onNext }: { index: number; current: boolean; onNext: () => void }) {
  const l = LINES[index];
  return (
    <View style={styles.lineShadow}>
      <FeatureCard shadow={false}>
        <FadeImageHeader source={l.art} height={196} y={l.artFocus} overlayFrom={0.35} topShade={0.15}>
          <RomanBadge roman={l.roman} />
        </FadeImageHeader>
        <View style={styles.lineBody}>
          <Text style={[sans(13, 600), { color: l.color }]}>{l.name}</Text>
          <Text style={serif(34)} accessibilityRole="header">
            {l.theme}
          </Text>
          <Text style={[sans(12.5, 400, 1.45), { color: colors.textFaint }]}>Detected · {l.seen}</Text>
          <Text style={[sans(15, 400, 1.6), { color: colors.textSoft, marginTop: 2 }]}>{l.body}</Text>
          {current ? (
            <Pill
              label={index < LINES.length - 1 ? 'Next line' : 'Reveal my archetype'}
              trailingIcon="arrow"
              onPress={onNext}
              style={{ marginTop: 4 }}
            />
          ) : null}
        </View>
      </FeatureCard>
    </View>
  );
}

/* ---------- archetype ---------- */

export function ArchetypeCard({ onOpen }: { onOpen: () => void }) {
  return (
    <View style={styles.archetype}>
      <ArchetypeArt width={200} height={262} />
      <Text style={[sans(13, 600), { color: colors.gold, marginTop: 8 }]}>Your love archetype</Text>
      <SerifTitle size={42} accent={ARCHETYPE.accent} accentColor={colors.pink} style={{ textAlign: 'center' }}>
        {ARCHETYPE.name}{' '}
      </SerifTitle>
      <Text style={[sans(14.5, 400, 1.55), { color: colors.textMuted, maxWidth: 300, textAlign: 'center' }]}>{ARCHETYPE.headline}</Text>
      <Pill label="Open my full reading" size="lg" trailingIcon="arrow" onPress={onOpen} style={{ marginTop: 6, alignSelf: 'center' }} />
    </View>
  );
}

/* ---------- remind ---------- */

export function RemindBubble({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <AuraBubble>
      <View style={styles.remindArt}>
        <CoverImage source={img.window} y={0.34} />
      </View>
      <Text style={[styles.auraText, { marginTop: 12 }]}>
        {"On Sunday I'll bring you a new guidance from your fate line. Shall I remind you?"}
      </Text>
      <Pill
        label={on ? 'Reminder set for Sunday' : 'Yes, remind me'}
        variant={on ? 'success' : 'primary'}
        icon="bell"
        onPress={onToggle}
        style={{ marginTop: 12 }}
      />
    </AuraBubble>
  );
}

/* ---------- upsell ---------- */

export function UpsellCard({ purchased, onBuy }: { purchased: boolean; onBuy: () => void }) {
  return (
    <FeatureCard bg={colors.surfaceDeep} shadow={false}>
      <FadeImageHeader source={img.gift} height={170} y={0.48} fadeTo={colors.surfaceDeep} />
      <View style={styles.upsellBody}>
        <SerifTitle size={30} accent="going" accentColor={colors.pink}>
          Keep the conversation{' '}
        </SerifTitle>
        <Text style={[sans(14, 400, 1.5), { color: colors.textMuted }]}>
          {"You've used your 10 questions. Add 10 more about this reading."}
        </Text>
        <Pill
          label={purchased ? 'Added · 10 more questions' : `Add 10 questions · ${PRICE.questionsPack} credits`}
          variant={purchased ? 'success' : 'primary'}
          inert={purchased}
          onPress={onBuy}
          style={{ marginTop: 4 }}
        />
      </View>
    </FeatureCard>
  );
}

/* ---------- typing ---------- */

const dotKeyframes = {
  '0%': { transform: [{ translateY: 0 }], opacity: 0.4 },
  '40%': { transform: [{ translateY: -4 }], opacity: 1 },
  '80%': { transform: [{ translateY: 0 }], opacity: 0.4 },
  '100%': { transform: [{ translateY: 0 }], opacity: 0.4 },
};

const pulseKeyframes = {
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
};

export function TypingIndicator() {
  return (
    <View style={styles.typing} accessibilityLabel="Master Aura is typing">
      <Animated.View
        style={[
          styles.orb,
          {
            animationName: pulseKeyframes,
            animationDuration: '1.6s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          },
        ]}
      >
        <CoverImage source={img.orb} style={{ transform: [{ scale: 1.24 }] }} />
      </Animated.View>
      <View style={styles.typingBubble}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                animationName: dotKeyframes,
                animationDuration: '1.2s',
                animationDelay: `${i * 150}ms`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aura: {
    alignSelf: 'flex-start',
    maxWidth: '86%',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.bubble,
    borderBottomLeftRadius: radii.bubbleTail,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  auraText: { ...sans(15, 400, 1.55), color: colors.textSoft },
  user: {
    alignSelf: 'flex-end',
    maxWidth: '78%',
    backgroundColor: colors.userBubble,
    borderRadius: radii.bubble,
    borderBottomRightRadius: radii.bubbleTail,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userText: { ...sans(15, 500, 1.5), color: colors.ink },
  intro: { alignItems: 'center', gap: 12, paddingTop: 10, paddingBottom: 18 },
  offerBody: { marginTop: -38, paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderColor: colors.hairline,
  },
  specLast: { borderBottomWidth: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 2 },
  pillStack: { gap: 8, marginTop: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  photo: { alignSelf: 'flex-end', alignItems: 'flex-end', gap: 6 },
  photoFrame: {
    padding: 3,
    borderRadius: 24,
    borderBottomRightRadius: radii.bubbleTail,
    backgroundColor: colors.userBubble,
  },
  lineShadow: { borderRadius: radii.card, ...shadows.card, shadowOpacity: 0.35, shadowRadius: 25, shadowOffset: { width: 0, height: 24 } },
  lineBody: { marginTop: -34, paddingHorizontal: 18, paddingBottom: 18, gap: 9 },
  archetype: { alignItems: 'center', gap: 12, paddingTop: 14, paddingBottom: 6 },
  remindArt: { height: 132, marginTop: -5, marginHorizontal: -8, borderRadius: 16, overflow: 'hidden' },
  upsellBody: { marginTop: -30, paddingHorizontal: 18, paddingBottom: 18, gap: 9 },
  typing: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 10 },
  orb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#F078C8',
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    height: 46,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.bubble,
    borderBottomLeftRadius: radii.bubbleTail,
    paddingHorizontal: 18,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lavender },
});

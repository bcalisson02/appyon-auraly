import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { img } from '@/features/auraly/assets';
import { FeatureCard, RowCard } from '@/features/auraly/components/cards';
import { ArchetypeArt, FadeImageHeader, HeaderBackdrop, Thumb } from '@/features/auraly/components/media';
import { PalmView } from '@/features/auraly/components/PalmView';
import { CoverImage, Pill, RomanBadge, SerifTitle } from '@/features/auraly/components/primitives';
import { ScreenHeader } from '@/features/auraly/components/ScreenHeader';
import { ARCHETYPE, lineById, type LineId } from '@/features/auraly/data/lines';
import { nav } from '@/features/auraly/navigation';
import { hasFinishedReading, useAuraly } from '@/features/auraly/store';
import { toast } from '@/features/auraly/store/toast';
import { colors, layout, radii, sans, serif } from '@/features/auraly/theme';

/** "Your Love Palm": archetype, the labeled palm, the selected line and retention hooks. */
export default function FullReading() {
  const { width } = useWindowDimensions();
  const hand = useAuraly((s) => s.hand);
  const reminderOn = useAuraly((s) => s.reminderOn);
  const toggleReminder = useAuraly((s) => s.toggleReminder);
  const askAbout = useAuraly((s) => s.askAbout);
  const [selected, setSelected] = useState<LineId>('heart');
  // Opened by URL before the reading exists: send the user to the chat instead of a fake result.
  const [ready] = useState(() => hasFinishedReading(useAuraly.getState()));
  const line = lineById(selected);

  const appWidth = Platform.OS === 'web' ? Math.min(width, layout.maxWidth) : width;
  const palmWidth = Math.min(350, appWidth - 40);

  const ask = () => {
    askAbout(selected);
    nav.chat();
  };

  if (!ready) return <Redirect href="/auraly/chat" />;

  return (
    <View style={styles.screen}>
      <HeaderBackdrop height={520} opacity={0.55} y={0.3} stops={[0.55, 0.2]} />
      <ScreenHeader title="Your Love Palm" onBack={() => nav.back(nav.chat)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ArchetypeArt width={176} height={230} />
          <Text style={[sans(13, 600), { color: colors.gold, marginTop: 8 }]}>Your love archetype · {hand} hand</Text>
          <SerifTitle size={46} lineHeight={0.98} accent={ARCHETYPE.accent} accentColor={colors.pink} style={{ textAlign: 'center' }}>
            {ARCHETYPE.name}{' '}
          </SerifTitle>
          <Text style={[sans(15, 400, 1.55), { color: colors.textMuted, maxWidth: 320, textAlign: 'center' }]}>{ARCHETYPE.body}</Text>
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.sectionHead}>
            <Text style={serif(28)} accessibilityRole="header">
              Your palm
            </Text>
            <Text style={[sans(12.5), { color: colors.textFaint }]}>Tap a line</Text>
          </View>
          <View style={styles.palmRing}>
            <PalmView width={palmWidth} hand={hand} labels selected={selected} onSelect={setSelected} drawDuration={1200} />
          </View>
        </View>

        <FeatureCard shadow={false}>
          <FadeImageHeader source={line.art} height={150} y={line.artFocus} overlayFrom={0.3}>
            <RomanBadge roman={line.roman} />
          </FadeImageHeader>
          <View style={styles.lineBody}>
            <Text style={[sans(13, 600), { color: line.color }]}>
              {line.name} · {line.value}
            </Text>
            <Text style={serif(32)}>{line.theme}</Text>
            <Text style={[sans(15, 400, 1.6), { color: colors.textSoft, marginTop: 2 }]}>{line.body}</Text>
            <Pill label="Ask Aura about this" trailingIcon="arrow" onPress={ask} style={{ marginTop: 4 }} />
          </View>
        </FeatureCard>

        <View style={{ gap: 10 }}>
          <Text style={serif(28)} accessibilityRole="header">
            Keep going
          </Text>
          <RowCard
            leading={<CalendarTile />}
            title="Weekly love guidance"
            subtitle="From your fate line, every Sunday"
            trailing={
              <Pill
                label={reminderOn ? 'On' : 'Remind me'}
                size="sm"
                variant={reminderOn ? 'success' : 'primary'}
                onPress={toggleReminder}
              />
            }
          />
          <RowCard
            leading={<Thumb source={img.holding} y={0.62} />}
            title="Compare palms with a partner"
            subtitle="Aura reads both heart lines together"
            onPress={() => toast('Partner invites are the next step for this feature.')}
          />
          <RowCard
            dashed
            title="Re-scan on Feb 7"
            subtitle="Lines change slowly. Aura will compare your next scan with tonight's."
            trailing={null}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/** "SUN 9" date tile on bg-waves. */
function CalendarTile() {
  return (
    <View style={styles.calendar}>
      <View style={StyleSheet.absoluteFill}>
        <CoverImage source={img.bgWaves} y={0.3} />
      </View>
      <Text style={[sans(9.5, 700), { letterSpacing: 0.6 }]}>SUN</Text>
      <Text style={serif(22)}>9</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 22 },
  hero: { alignItems: 'center', gap: 10, paddingTop: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  palmRing: { alignSelf: 'center', borderRadius: radii.card, borderWidth: 1, borderColor: colors.borderStrong, overflow: 'hidden' },
  lineBody: { marginTop: -28, paddingHorizontal: 18, paddingBottom: 18, gap: 9 },
  calendar: {
    width: 52,
    height: 52,
    borderRadius: radii.thumbSm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});

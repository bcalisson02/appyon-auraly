import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { img } from '@/features/auraly/assets';
import { FeatureCard, RowCard, Tile, TileGrid } from '@/features/auraly/components/cards';
import { AuraAvatar, FadeImageHeader, HeaderBackdrop, Thumb } from '@/features/auraly/components/media';
import { CreditsPill, GlassTag, Pill, SerifTitle } from '@/features/auraly/components/primitives';
import { count } from '@/features/auraly/format';
import { hasFinishedReading, PRICE, questionsLeft, useAuraly } from '@/features/auraly/store';
import { toast } from '@/features/auraly/store/toast';
import { colors, layout, sans, serif } from '@/features/auraly/theme';

export default function Home() {
  const insets = useSafeAreaInsets();
  const credits = useAuraly((s) => s.credits);
  const paid = useAuraly((s) => s.paid);
  const finished = useAuraly(hasFinishedReading);
  const left = useAuraly(questionsLeft);

  const cta = finished ? 'Open' : paid ? 'Continue' : 'Start';
  const openPalm = () => router.push(finished ? '/auraly/reading' : '/auraly/chat');

  return (
    <View style={styles.screen}>
      <HeaderBackdrop height={480} opacity={0.5} y={0.2} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: layout.tabBarHeight + layout.tabBarBottom + insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={[sans(13), { color: colors.textMuted }]}>Saturday · Moon in Pisces</Text>
            <SerifTitle size={40} accent="Sofia">
              Hello,{' '}
            </SerifTitle>
          </View>
          <CreditsPill credits={credits} onLongPress={() => router.push('/auraly/demo')} />
        </View>

        <FeatureCard onPress={openPalm} accessibilityLabel={`Love Palm Reading. ${cta}`}>
          <FadeImageHeader source={img.handsRing} height={240} y={0.4} overlayFrom={null}>
            <GlassTag>
              <Text style={sans(12, 600)}>New reading</Text>
            </GlassTag>
          </FadeImageHeader>
          <View style={styles.heroBody}>
            <Text style={[sans(13, 600), { color: colors.lavender }]}>Love Palm Reading</Text>
            <SerifTitle size={34} accent="know" accentColor={colors.pink} after=" about love">
              What your hands{' '}
            </SerifTitle>
            <Text style={[sans(14.5, 400, 1.55), { color: colors.textMuted }]}>
              Master Aura reads your four palm lines, then answers your questions about each one.
            </Text>
            <View style={styles.heroFooter}>
              <AuraAvatar size={30} />
              <Text style={[sans(13), { color: colors.textMeta, flex: 1 }]} numberOfLines={2}>
                With Master Aura · {PRICE.reading} credits
              </Text>
              <Pill label={cta} trailingIcon="arrow" onPress={openPalm} />
            </View>
          </View>
        </FeatureCard>

        {finished ? (
          <RowCard
            leading={<Thumb source={img.devotedFlame} />}
            title="Your Love Palm"
            subtitle={`The Devoted Flame · ${count(left, 'question')} left`}
            onPress={() => router.push('/auraly/reading')}
          />
        ) : null}

        <View style={{ gap: 12 }}>
          <Text style={serif(28)} accessibilityRole="header">
            For you tonight
          </Text>
          <TileGrid>
            <Tile
              title="Daily horoscope"
              subtitle="Libra · honest words"
              source={img.bgWaves}
              y={0.25}
              imageHeight={132}
              onPress={() => toast('Daily horoscope lives in Insights, outside this prototype.')}
            />
            <Tile
              title="Ask Master Aura"
              subtitle="Chat or voice"
              source={img.masterAura}
              y={0.22}
              imageHeight={132}
              onPress={() => router.push('/auraly/chat')}
            />
          </TileGrid>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 18, gap: 22 },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  heroBody: { marginTop: -44, paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
});

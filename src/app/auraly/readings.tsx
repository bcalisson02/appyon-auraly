import { ScrollView, StyleSheet, View } from 'react-native';

import { img } from '@/features/auraly/assets';
import { Tile, TileGrid } from '@/features/auraly/components/cards';
import { PageTitle, ScreenHeader } from '@/features/auraly/components/ScreenHeader';
import { nav } from '@/features/auraly/navigation';
import { hasFinishedReading, useAuraly } from '@/features/auraly/store';
import { toast } from '@/features/auraly/store/toast';
import { colors } from '@/features/auraly/theme';

/** History hub: everything Aura has read for the user. */
export default function Readings() {
  const finished = useAuraly(hasFinishedReading);
  const reminderOn = useAuraly((s) => s.reminderOn);
  const used = useAuraly((s) => s.questionsUsed);

  const tiles = [
    {
      title: 'Love Palm',
      subtitle: finished ? 'The Devoted Flame' : 'Not read yet',
      source: img.handsRing,
      y: 0.45,
      onPress: finished ? nav.reading : nav.chat,
    },
    {
      title: 'Birth Chart',
      subtitle: 'Libra Sun · Pisces Moon',
      source: img.bgWaves,
      y: 0.2,
      onPress: () => toast('Birth Chart opens in Insights, outside this prototype.'),
    },
    {
      title: 'Sunday Guidance',
      subtitle: reminderOn ? 'Reminder on · in 2 days' : 'Arrives in 2 days',
      source: img.window,
      y: 0.3,
      dimmed: !finished,
      onPress: () => toast(finished ? 'Your first Sunday guidance arrives Nov 9.' : 'Unlocks after your first palm reading.'),
    },
    {
      title: 'Conversations',
      subtitle: `${used} questions asked`,
      source: img.writing,
      y: 0.4,
      onPress: nav.conversations,
    },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => nav.back(nav.chat)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageTitle title="Readings" subtitle="Everything Aura has read for you." />
        <View style={{ gap: 10 }}>
          {[tiles.slice(0, 2), tiles.slice(2)].map((pair) => (
            <TileGrid key={pair[0].title}>
              {pair.map((t) => (
                <Tile key={t.title} {...t} imageHeight={150} />
              ))}
            </TileGrid>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 40, gap: 20 },
});

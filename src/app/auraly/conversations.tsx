import { ScrollView, StyleSheet, View } from 'react-native';

import { img } from '@/features/auraly/assets';
import { ConversationRow } from '@/features/auraly/components/ConversationRow';
import { PageTitle, ScreenHeader } from '@/features/auraly/components/ScreenHeader';
import { PAST_CONVERSATIONS } from '@/features/auraly/data/conversations';
import { nav } from '@/features/auraly/navigation';
import { count } from '@/features/auraly/format';
import { lastAuraText, questionsLeft, useAuraly } from '@/features/auraly/store';
import { colors } from '@/features/auraly/theme';

/** Every talk with Master Aura. The live Love Palm thread first, then mocked history. */
export default function Conversations() {
  const paid = useAuraly((s) => s.paid);
  const used = useAuraly((s) => s.questionsUsed);
  const left = useAuraly(questionsLeft);
  const preview = useAuraly(lastAuraText);

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => nav.back(nav.readings)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageTitle title="Conversations" subtitle="Every talk with Master Aura, saved." />
        <View style={{ gap: 10 }}>
          <ConversationRow
            current
            title="Love Palm Reading"
            date={paid ? 'Tonight' : ''}
            preview={preview ?? 'Not started yet'}
            meta={paid ? `${count(used, 'question')} asked · ${left} left` : 'Tap to begin'}
            art={img.handsRing}
            artFocus={0.45}
            onPress={nav.chat}
          />
          {PAST_CONVERSATIONS.map((c) => (
            <ConversationRow
              key={c.id}
              title={c.title}
              date={c.date}
              preview={c.preview}
              meta={`${c.messages.length} messages`}
              art={c.art}
              artFocus={c.artFocus}
              onPress={() => nav.transcript(c.id)}
            />
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

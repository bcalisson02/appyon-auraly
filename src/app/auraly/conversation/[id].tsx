import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuraBubble, UserBubble } from '@/features/auraly/components/chat/messages';
import { ScreenHeader } from '@/features/auraly/components/ScreenHeader';
import { pastConversationById } from '@/features/auraly/data/conversations';
import { nav } from '@/features/auraly/navigation';
import { colors, sans } from '@/features/auraly/theme';

/** Read-only transcript of a past (mocked) conversation. */
export default function Transcript() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const convo = pastConversationById(id);
  const back = () => nav.back(nav.conversations);

  if (!convo) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Conversation" onBack={back} />
        <Text style={[sans(14.5), styles.note]}>This conversation is no longer available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={convo.title} onBack={back} />
      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={[sans(12), styles.note]}>{convo.date} · read-only</Text>
        {convo.messages.map((m, i) => (m.from === 'aura' ? <AuraBubble key={i} text={m.text} /> : <UserBubble key={i} text={m.text} />))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  note: { color: colors.textFaint, textAlign: 'center', paddingVertical: 8 },
});

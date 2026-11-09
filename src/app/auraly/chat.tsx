import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { FadeMask } from '@/components/FadeMask';
import { img } from '@/features/auraly/assets';
import { ChatHeader } from '@/features/auraly/components/chat/ChatHeader';
import { ChatMessage, type ChatContext } from '@/features/auraly/components/chat/ChatMessage';
import { Composer, type Suggestion } from '@/features/auraly/components/chat/Composer';
import { ChatIntro, TypingIndicator } from '@/features/auraly/components/chat/messages';
import { CoverImage } from '@/features/auraly/components/primitives';
import { LINES, lineById } from '@/features/auraly/data/lines';
import { nav } from '@/features/auraly/navigation';
import { hasFinishedReading, isReadingStage, questionsLeft, useAuraly } from '@/features/auraly/store';
import { toast } from '@/features/auraly/store/toast';
import { colors } from '@/features/auraly/theme';

/** Ask for the camera (the scan itself is simulated). Web always continues with the sample photo. */
async function cameraAllowed(): Promise<boolean> {
  if (useAuraly.getState().demo.cameraDenied) return false;
  if (Platform.OS === 'web') return true;
  try {
    const res = await Camera.requestCameraPermissionsAsync();
    return res.granted;
  } catch {
    return false;
  }
}

export default function ChatScreen() {
  const s = useAuraly();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  // Messages restored from storage render in place; only new ones animate in.
  const [restoredIds] = useState(() => new Set(useAuraly.getState().items.map((m) => m.id)));

  const reading = isReadingStage(s);
  const left = questionsLeft(s);
  const finished = hasFinishedReading(s);
  const ctxLine = lineById(s.contextLine);

  const openCamera = async () => {
    if (s.stage !== 'camera' || s.typing) return;
    if (await cameraAllowed()) nav.scan();
    else s.cameraDenied();
  };

  const ctx: ChatContext = {
    credits: s.credits,
    paid: s.paid,
    hand: s.hand,
    cameraActive: s.stage === 'camera',
    currentLine: s.stage === 'line' && !s.typing ? s.lineIndex : null,
    extraPacks: s.extraPacks,
    reminderOn: s.reminderOn,
    onBuyReading: s.startReading,
    onOpenCamera: openCamera,
    onAllowCamera: async () => {
      if (s.demo.cameraDenied) s.setDemoFlag('cameraDenied', false); // demo: the user grants access
      if (await cameraAllowed()) return nav.scan();
      if (Platform.OS !== 'web') Linking.openSettings();
    },
    onSamplePhoto: () => {
      s.chooseSamplePhoto();
      nav.scan();
    },
    onNextLine: s.nextLine,
    onOpenReading: nav.reading,
    onToggleReminder: s.toggleReminder,
    onBuyQuestions: s.buyMoreQuestions,
    onGetCredits: () => toast('Credit packs open in the store.'),
    onDeclineCredits: s.declineCredits,
  };

  // Suggested questions per stage (hidden while Aura is typing).
  let suggestions: Suggestion[] = [];
  if (!s.typing) {
    const asks = (qs: readonly string[]) => qs.map((q) => ({ text: q, onPress: () => s.ask(q) }));
    if (s.stage === 'offer') suggestions = asks(['What is palm reading?', 'Is it accurate?']);
    else if (s.stage === 'hand')
      suggestions = [
        { text: 'My right hand', onPress: () => s.pickHand('right'), primary: true },
        { text: 'My left hand', onPress: () => s.pickHand('left') },
      ];
    else if (s.stage === 'line' && left > 0) suggestions = asks(LINES[s.lineIndex].asks);
    else if (s.stage === 'free' && left > 0) suggestions = asks(ctxLine.asks);
  }

  const status = s.typing ? 'Typing…' : s.stage === 'line' ? 'Reading your palm' : 'Palm reader · online';
  const placeholder = reading
    ? left > 0
      ? `Ask about your ${ctxLine.name.toLowerCase()}`
      : 'Add more questions above'
    : 'Message Master Aura';

  return (
    <View style={styles.screen}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CoverImage source={img.bgClouds} y={1} />
        <LinearGradient
          colors={['rgba(11,8,26,0.96)', 'rgba(11,8,26,0.9)', 'rgba(11,8,26,0.72)', 'rgba(11,8,26,0.55)']}
          locations={[0, 0.5, 0.8, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ChatHeader
        status={status}
        credits={s.credits}
        hasReading={finished}
        onBack={() => nav.back()}
        onReadings={nav.readings}
        onCreditsLongPress={nav.demo}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'web' ? undefined : 'padding'}>
        <FadeMask top={28} bottom={44} style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            // The viewport also shrinks when suggestions come back after "Typing…": stay pinned to the last message.
            onLayout={() => scrollRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ChatIntro />
            {s.items.map((item) => (
              <ChatMessage key={item.id} item={item} ctx={ctx} animate={!restoredIds.has(item.id)} />
            ))}
            {s.typing ? <TypingIndicator /> : null}
          </ScrollView>
        </FadeMask>

        <Composer
          placeholder={placeholder}
          left={reading ? left : null}
          disabled={reading && left <= 0}
          suggestions={suggestions}
          lineSelector={s.stage === 'free' ? { value: s.contextLine, onChange: s.setContextLine } : null}
          onSend={s.ask}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingBottom: 36, gap: 12 },
});

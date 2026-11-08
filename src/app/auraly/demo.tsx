import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill } from '@/features/auraly/components/primitives';
import { useAuraly, STARTING_CREDITS } from '@/features/auraly/store';
import { toast } from '@/features/auraly/store/toast';
import { colors, radii, sans, serif } from '@/features/auraly/theme';

/**
 * Demo controls (long-press the credits pill). Lets reviewers reach the edge
 * cases on any device: low credits, denied camera, undetected hand, fresh start.
 */
export default function DemoControls() {
  const insets = useSafeAreaInsets();
  const credits = useAuraly((s) => s.credits);
  const demo = useAuraly((s) => s.demo);
  const setCredits = useAuraly((s) => s.setCredits);
  const setDemoFlag = useAuraly((s) => s.setDemoFlag);
  const resetReading = useAuraly((s) => s.resetReading);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/auraly'));

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      <View style={styles.head}>
        <Text style={serif(34)} accessibilityRole="header">
          Demo controls
        </Text>
        <Pressable onPress={close} accessibilityRole="button" hitSlop={8}>
          <Text style={[sans(14.5, 600), { color: colors.lavender }]}>Done</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={[sans(14, 400, 1.5), { color: colors.textMuted }]}>
          Prototype-only switches to try the edge cases from the handoff. Everything is local to this device.
        </Text>

        <Section title={`Credits · ${credits}`}>
          <View style={styles.row}>
            <Pill label="Set to 10" variant="glass" onPress={() => setCredits(10)} />
            <Pill label={`Reset to ${STARTING_CREDITS}`} variant="glass" onPress={() => setCredits(STARTING_CREDITS)} />
          </View>
          <Text style={styles.help}>{"Below 15 credits the reading can't be bought; below 5, extra questions can't."}</Text>
        </Section>

        <Section title="Scan">
          <Toggle
            label="Camera permission denied"
            help="“Open camera” shows Aura's permission message with a sample-photo option."
            value={demo.cameraDenied}
            onChange={(v) => setDemoFlag('cameraDenied', v)}
          />
          <Toggle
            label="Hand not detected"
            help="The scan never aligns; after 6 s Aura asks you to move back. Long-press the shutter does the same."
            value={demo.handNotDetected}
            onChange={(v) => setDemoFlag('handNotDetected', v)}
          />
        </Section>

        <Section title="Reading">
          <Pill
            label="Start over"
            onPress={() => {
              resetReading();
              toast('Reading reset. Your palm is waiting.');
              router.dismissTo('/auraly');
            }}
          />
          <Text style={styles.help}>Clears the chat thread, questions and reminder. Credits are kept.</Text>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[sans(13, 600), { color: colors.gold }]}>{title}</Text>
      {children}
    </View>
  );
}

function Toggle({ label, help, value, onChange }: { label: string; help: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={sans(14.5, 600)}>{label}</Text>
        <Text style={styles.help}>{help}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.success, false: 'rgba(255,255,255,0.15)' }}
        thumbColor="#fff"
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  content: { paddingHorizontal: 20, gap: 22 },
  section: {
    gap: 12,
    padding: 16,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glassTile,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  help: { ...sans(12.5, 400, 1.45), color: colors.textFaint },
});

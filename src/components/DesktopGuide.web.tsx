import { usePathname } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { nav } from '@/features/auraly/navigation';
import { colors, fonts, radii, sans, serif } from '@/features/auraly/theme';

const REPO = 'https://github.com/bcalisson02/appyon-auraly';

const STEPS = [
  'Na Home, toque em Start no card Love Palm Reading.',
  'No chat: Read my palm → escolha a mão → Open camera.',
  'Espere alinhar, toque no obturador e envie para a Master Aura.',
  'Avance pelas 4 linhas até revelar o arquétipo.',
  'Pergunte sobre uma linha, abra o resultado completo e o histórico (botão de grade no topo do chat).',
];

/**
 * Side panel for evaluators on desktop browsers (≥ 1000 px): what this is,
 * a short test script and a visible way into the demo controls, which on a
 * phone hide behind a long-press on the credits pill. Not part of the app UI.
 */
export function DesktopGuide() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  if (width < 1000) return null;
  // Already open: don't stack a second copy.
  const openDemo = () => pathname !== '/auraly/demo' && nav.demo();

  return (
    <View style={styles.panel} accessibilityRole="complementary" accessibilityLabel="Guia do protótipo">
      <Text style={[sans(12, 600), styles.eyebrow]}>APPYON · DESAFIO 2</Text>
      <Text style={serif(40, 1.05)}>
        Auraly <Text style={{ color: colors.pink, fontFamily: fonts.serifItalic }}>Love Palm</Text> Reading
      </Text>
      <Text style={[sans(14, 400, 1.55), styles.muted]}>
        Protótipo navegável em React Native + Expo, rodando na web. A coluna ao lado é o app no tamanho de um iPhone (390 pt). No celular, o
        mesmo link ocupa a tela inteira.
      </Text>

      <View style={styles.steps}>
        <Text style={[sans(13, 600), { color: colors.white }]}>Como testar (≈ 2 min)</Text>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.step}>
            <Text style={[sans(12, 600), styles.num]}>{i + 1}</Text>
            <Text style={[sans(13.5, 400, 1.5), styles.muted, { flex: 1 }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={openDemo} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}>
          <Text style={[sans(14, 600), { color: colors.ink }]}>Controles de demo</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(REPO)} style={({ pressed }) => [styles.ghost, pressed && { opacity: 0.85 }]}>
          <Text style={[sans(14, 600), { color: colors.white }]}>Código no GitHub</Text>
        </Pressable>
      </View>
      <Text style={[sans(12, 400, 1.5), styles.faint]}>
        Os controles simulam créditos baixos, câmera negada, mão não detectada e recomeçar a leitura. No app, eles abrem segurando o selo de
        créditos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { width: 340, alignSelf: 'center', gap: 18 },
  eyebrow: { color: colors.lavender, letterSpacing: 1.2 },
  muted: { color: colors.textMuted },
  faint: { color: colors.textFaint },
  steps: { gap: 10, paddingTop: 4 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  num: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', gap: 10, paddingTop: 4 },
  primary: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: radii.pill, backgroundColor: colors.white },
  ghost: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});

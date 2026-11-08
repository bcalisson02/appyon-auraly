import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useToast } from '../store/toast';
import { colors, sans, shadows } from '../theme';

/** Centered toast above the composer / tab bar (bottom 118). Auto-hides after 2.4 s. */
export function Toast() {
  const message = useToast((s) => s.message);
  const key = useToast((s) => s.key);
  if (!message) return null;
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View key={key} entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.toast}>
        <Text style={styles.text} accessibilityLiveRegion="polite">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', zIndex: 9, left: 24, right: 24, bottom: 118, alignItems: 'center' },
  toast: {
    backgroundColor: colors.toastBg,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 16,
    ...shadows.toast,
  },
  text: { ...sans(13.5, 500, 1.4), color: colors.ink, textAlign: 'center' },
});

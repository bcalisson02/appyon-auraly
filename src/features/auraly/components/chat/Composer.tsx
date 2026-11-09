import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LINES, type LineId } from '../../data/lines';
import { colors, radii, sans } from '../../theme';
import { Icon } from '../Icon';
import { Dot } from '../primitives';

export interface Suggestion {
  text: string;
  onPress(): void;
  primary?: boolean;
}

/** 4 equal pills (Heart / Head / Life / Fate). Shown after the archetype. */
export function LineSelector({ value, onChange }: { value: LineId; onChange(id: LineId): void }) {
  const { width } = useWindowDimensions();
  const small = width <= 360;
  return (
    <View style={styles.selector} accessibilityRole="tablist">
      {LINES.map((l) => {
        const on = l.id === value;
        return (
          <Pressable
            key={l.id}
            onPress={() => onChange(l.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.lineChip, on ? styles.chipOn : styles.chipOff, small && { paddingHorizontal: 6, gap: 4 }]}
          >
            <Dot color={l.color} />
            <Text style={[sans(small ? 12 : 12.5, 600), { color: on ? colors.ink : colors.textSoft }]} numberOfLines={1}>
              {l.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Always a 2-column grid of equal widths (never horizontal scroll). */
export function SuggestedQuestions({ items }: { items: Suggestion[] }) {
  return (
    <View style={styles.grid}>
      {items.map((q) => (
        <Pressable
          key={q.text}
          onPress={q.onPress}
          accessibilityRole="button"
          style={({ pressed }) => [styles.question, q.primary ? styles.chipOn : styles.questionGlass, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[sans(13.5, 500, 1.3), { color: q.primary ? colors.ink : colors.textSoft }]}>{q.text}</Text>
        </Pressable>
      ))}
    </View>
  );
}

interface ComposerProps {
  placeholder: string;
  left: number | null;
  disabled: boolean;
  suggestions: Suggestion[];
  lineSelector: { value: LineId; onChange(id: LineId): void } | null;
  /** Returns false when the message was not accepted; the draft is then kept. */
  onSend(text: string): boolean;
}

export function Composer({ placeholder, left, disabled, suggestions, lineSelector, onSend }: ComposerProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  const send = () => {
    if (disabled || !text.trim()) return;
    if (onSend(text)) setText('');
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 16) + 6 }]}>
      {lineSelector ? <LineSelector {...lineSelector} /> : null}
      {suggestions.length ? <SuggestedQuestions items={suggestions} /> : null}
      <View style={styles.input}>
        <BlurView intensity={30} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: radii.pill }]} />
        {/* Content row is a View so it paints above the absolute blur layer on web. */}
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={colors.textFaint}
            returnKeyType="send"
            submitBehavior="submit"
            style={styles.field}
            accessibilityLabel={placeholder}
          />
          {left !== null ? <Text style={[sans(12), { color: colors.textFaint }]}>{left} left</Text> : null}
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Send"
            accessibilityState={{ disabled: disabled || !text.trim() }}
            style={({ pressed }) => [styles.send, { opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }]}
          >
            <Icon name="send" size={18} color={colors.ink} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: -20, paddingTop: 6, paddingHorizontal: 16, gap: 10 },
  selector: { flexDirection: 'row', gap: 6 },
  lineChip: {
    flex: 1,
    minWidth: 0,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  chipOn: { backgroundColor: colors.white, borderColor: 'transparent' },
  chipOff: { backgroundColor: colors.chipGlass, borderColor: colors.borderStrong },
  grid: { flexDirection: 'row', gap: 8 },
  question: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: radii.question,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  questionGlass: { backgroundColor: colors.chipGlass, borderColor: colors.borderStrong },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.composerGlass,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, paddingRight: 5, paddingLeft: 18 },
  field: {
    flex: 1,
    minWidth: 0,
    ...sans(15),
    color: colors.white,
    paddingVertical: 9,
    outlineStyle: 'none',
  } as object,
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

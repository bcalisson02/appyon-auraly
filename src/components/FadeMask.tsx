import RNMaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ComponentType, type ReactElement, type ReactNode } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

// The library ships class-component typings that predate React 19's JSX types.
const MaskedView = RNMaskedView as unknown as ComponentType<{
  maskElement: ReactElement;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}>;

export interface FadeMaskProps {
  /** Height (pt) over which the top edge fades in. */
  top?: number;
  /** Height (pt) over which the bottom edge fades out. */
  bottom?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Fades the top/bottom edges of its content to transparent (alpha mask), so
 * scrolling content dissolves over any background. Native: MaskedView.
 * Web: CSS mask-image (see FadeMask.web.tsx).
 */
export function FadeMask({ top = 0, bottom = 0, style, children }: FadeMaskProps) {
  const [h, setH] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setH(e.nativeEvent.layout.height);
  const t = h ? Math.min(top / h, 0.5) : 0;
  const b = h ? Math.max(1 - bottom / h, 0.5) : 1;

  return (
    <View style={style} onLayout={onLayout}>
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <LinearGradient style={{ flex: 1 }} colors={['transparent', '#000', '#000', 'transparent']} locations={[0, t, b, 1]} />
        }
      >
        {children}
      </MaskedView>
    </View>
  );
}

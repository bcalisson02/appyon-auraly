import { useEffect, useRef, type ComponentRef } from 'react';
import { View } from 'react-native';

import type { FadeMaskProps } from './FadeMask';

/**
 * Web version of FadeMask. MaskedView has no web implementation, so we apply a
 * CSS mask-image directly on the DOM node (react-native-web refs are elements).
 */
export function FadeMask({ top = 0, bottom = 0, style, children }: FadeMaskProps) {
  const ref = useRef<ComponentRef<typeof View>>(null);

  useEffect(() => {
    const el = ref.current as unknown as HTMLElement | null;
    if (!el) return;
    const mask = `linear-gradient(180deg, transparent 0, #000 ${top}px, #000 calc(100% - ${bottom}px), transparent 100%)`;
    el.style.setProperty('mask-image', mask);
    el.style.setProperty('-webkit-mask-image', mask);
  }, [top, bottom]);

  return (
    <View ref={ref} style={style}>
      {children}
    </View>
  );
}

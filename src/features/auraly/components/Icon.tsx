import Svg, { Path } from 'react-native-svg';

/** Stroke icons from prototype/palm-data.js (24×24 grid). */
const ICONS = {
  home: 'M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z',
  journey: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  insights: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  community: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 2.7-5 6-5s6 2 6 5M16 11a2.5 2.5 0 1 0 0-5M18 14c2 .5 3 2 3 4',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-3.5 3.6-6 8-6s8 2.5 8 6',
  camera: 'M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
  back: 'M15 18l-6-6 6-6',
  close: 'M18 6L6 18M6 6l12 12',
  send: 'M12 19V5M5 12l7-7 7 7',
  check: 'M5 12l5 5L20 7',
  chev: 'M9 6l6 6-6 6',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
} as const;

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = '#fff', strokeWidth = 2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={ICONS[name]} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

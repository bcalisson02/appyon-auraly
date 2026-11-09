import type { BottomTabBarProps } from 'expo-router/tabs';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { toast } from '../store/toast';
import { colors, layout, radii, sans } from '../theme';
import { Icon, type IconName } from './Icon';

interface TabDef {
  /** Route name when the tab is part of this prototype. */
  route?: string;
  label: string;
  icon: IconName;
}

const TABS: TabDef[] = [
  { route: 'index', label: 'Home', icon: 'home' },
  { label: 'Journey', icon: 'journey' },
  { label: 'Insights', icon: 'insights' },
  { label: 'Community', icon: 'community' },
  { label: 'Profile', icon: 'profile' },
];

/** Floating glass tab bar (left/right 16, bottom 24, height 66, radius 33). */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;
  const routeKey = (name: string) => state.routes.find((r) => r.name === name)?.key;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(layout.tabBarBottom, insets.bottom + 4) }]}>
      <View style={styles.bar}>
        <BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: radii.pill }]} />
        <View style={[StyleSheet.absoluteFill, styles.tint]} />
        {TABS.map((tab) => {
          const active = tab.route === activeRoute;
          const color = active ? colors.white : colors.textFaint;
          const onPress = () => {
            if (!tab.route) return toast(`${tab.label} is outside this prototype.`);
            const key = routeKey(tab.route);
            if (!active && key) navigateToTab(key);
          };
          return (
            <Pressable
              key={tab.label}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
            >
              <Icon name={tab.icon} size={22} color={color} strokeWidth={1.8} />
              <Text style={[sans(10.5, 600), { color }]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16 },
  bar: {
    height: layout.tabBarHeight,
    borderRadius: radii.pill,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderChip,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 14,
  },
  tint: { backgroundColor: colors.tabBarBg },
  item: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', gap: 4 },
});

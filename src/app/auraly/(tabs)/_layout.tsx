import { Tabs } from 'expo-router/tabs';

import { TabBar } from '@/features/auraly/components/TabBar';
import { colors } from '@/features/auraly/theme';

/**
 * Auraly's main tabs. Only Home belongs to this prototype; the other four tabs
 * live in the full product, so the TabBar shows a toast for them (per handoff).
 */
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
    </Tabs>
  );
}

import { router } from 'expo-router';

/**
 * Navigation helpers. The chat is a single thread, so we never stack two copies:
 * `dismissTo` returns to the chat already in the stack, or replaces the current
 * screen with it when there is none (e.g. Home → Full reading → "Ask Aura").
 */
export const nav = {
  home: () => router.dismissTo('/auraly'),
  chat: () => router.dismissTo('/auraly/chat'),
  pushChat: () => router.push('/auraly/chat'),
  reading: () => router.push('/auraly/reading'),
  readings: () => router.push('/auraly/readings'),
  conversations: () => router.push('/auraly/conversations'),
  transcript: (id: string) => router.push({ pathname: '/auraly/conversation/[id]', params: { id } }),
  scan: () => router.push('/auraly/scan'),
  demo: () => router.push('/auraly/demo'),
  back: (fallback?: () => void) => (router.canGoBack() ? router.back() : (fallback ?? (() => router.dismissTo('/auraly')))()),
};

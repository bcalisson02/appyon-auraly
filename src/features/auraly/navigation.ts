import { router } from 'expo-router';

/**
 * Navigation helpers. The chat is a single thread, so we never stack two copies:
 * `dismissTo` returns to the chat already in the stack, or replaces the current
 * screen with it when there is none (e.g. Home → Full reading → "Ask Aura").
 *
 * Every action is guarded against double taps: a second navigation within
 * 500 ms is ignored, so a quick double click never pushes a screen twice or
 * pops two screens at once.
 */
let lastNav = 0;
let running = false;
const once =
  <A extends unknown[]>(fn: (...args: A) => void) =>
  (...args: A) => {
    // Nested call (e.g. `back(nav.chat)` falling back to chat): part of the same tap.
    if (running) return fn(...args);
    const now = Date.now();
    if (now - lastNav < 500) return;
    lastNav = now;
    running = true;
    try {
      fn(...args);
    } finally {
      running = false;
    }
  };

export const nav = {
  home: once(() => router.dismissTo('/auraly')),
  chat: once(() => router.dismissTo('/auraly/chat')),
  pushChat: once(() => router.push('/auraly/chat')),
  reading: once(() => router.push('/auraly/reading')),
  readings: once(() => router.push('/auraly/readings')),
  conversations: once(() => router.push('/auraly/conversations')),
  transcript: once((id: string) => router.push({ pathname: '/auraly/conversation/[id]', params: { id } })),
  scan: once(() => router.push('/auraly/scan')),
  demo: once(() => router.push('/auraly/demo')),
  back: once((fallback?: () => void) => {
    if (router.canGoBack()) router.back();
    else if (fallback) fallback();
    else router.dismissTo('/auraly');
  }),
};

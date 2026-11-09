/**
 * Auraly Love Palm store: one chat thread that carries the whole reading.
 * Zustand + AsyncStorage persistence, so the thread and history survive reloads.
 * The "AI" is mocked: replies come from data/replies.ts after a short typing delay.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LINES, lineById } from '../data/lines';
import { reply, replyBeforeReading, thinkingDelay } from '../data/replies';
import type { AuralyData, AuralyState, ChatItem, NewChatItem } from './types';

export * from './types';

export const PRICE = { reading: 15, questionsPack: 5 } as const;
export const QUESTIONS_PER_PACK = 10;
export const STARTING_CREDITS = 277;

let seq = 0;
const newId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;
const withIds = (items: NewChatItem[]): ChatItem[] => items.map((m) => ({ ...m, id: newId() }) as ChatItem);

const INITIAL_ITEMS: NewChatItem[] = [
  {
    kind: 'aura',
    text: 'Your palm carries four lines that speak about how you love, how you choose, and where love is leading you. Would you like me to read them?',
  },
  { kind: 'offer' },
];

const initialData = (): AuralyData => ({
  credits: STARTING_CREDITS,
  stage: 'offer',
  hand: 'right',
  items: withIds(INITIAL_ITEMS),
  paid: false,
  lineIndex: 0,
  contextLine: 'heart',
  questionsUsed: 0,
  extraPacks: 0,
  reminderOn: false,
  reminderShown: false,
  pending: null,
  demo: { handNotDetected: false, cameraDenied: false },
});

/* ---------- selectors (pure, reusable by any screen) ---------- */

export const questionLimit = (s: Pick<AuralyData, 'extraPacks'>) => QUESTIONS_PER_PACK * (1 + s.extraPacks);
export const questionsLeft = (s: Pick<AuralyData, 'extraPacks' | 'questionsUsed'>) => Math.max(0, questionLimit(s) - s.questionsUsed);
export const isReadingStage = (s: Pick<AuralyData, 'stage'>) => s.stage === 'line' || s.stage === 'free';
export const hasFinishedReading = (s: Pick<AuralyData, 'items'>) => s.items.some((m) => m.kind === 'ready');
export const lastAuraText = (s: Pick<AuralyData, 'items'>) => {
  for (let i = s.items.length - 1; i >= 0; i--) {
    const m = s.items[i];
    if (m.kind === 'aura' || m.kind === 'camera') return m.text;
  }
  return undefined;
};

let timer: ReturnType<typeof setTimeout> | undefined;

export const useAuraly = create<AuralyState>()(
  persist(
    (set, get) => {
      const push = (...items: NewChatItem[]) => set((s) => ({ items: [...s.items, ...withIds(items)] }));
      const user = (text: string) => push({ kind: 'user', text });

      /** Mocked AI turn: show typing, then append `items` and apply `patch`. */
      const auraSays = (items: NewChatItem[], patch: Partial<AuralyData> = {}, delay = thinkingDelay()) => {
        const token = Date.now();
        set({ typing: true, pending: { token, items, patch } });
        clearTimeout(timer);
        timer = setTimeout(() => get().flushPending(token), delay);
      };

      const charge = (amount: number, product: 'reading' | 'questions'): boolean => {
        const { credits } = get();
        if (credits >= amount) {
          // Older "not enough credits" bubbles for this product are settled by the purchase.
          set((s) => ({
            credits: credits - amount,
            items: s.items.map((m) => (m.kind === 'noCredits' && m.product === product && !m.resolved ? { ...m, resolved: true } : m)),
          }));
          return true;
        }
        auraSays([{ kind: 'noCredits', product, need: amount, have: credits }], {}, 900);
        return false;
      };

      return {
        ...initialData(),
        typing: false,
        hydrated: false,

        flushPending(token) {
          const { pending } = get();
          if (!pending || (token !== undefined && pending.token !== token)) return;
          set((s) => ({
            ...pending.patch,
            items: [...s.items, ...withIds(pending.items)],
            pending: null,
            typing: false,
          }));
        },

        startReading() {
          const s = get();
          if (s.paid || s.typing) return;
          user('Read my palm');
          if (!charge(PRICE.reading, 'reading')) return;
          set({ paid: true, stage: 'wait' });
          auraSays(
            [
              {
                kind: 'aura',
                text: 'Which hand do you write with? Your dominant hand shows the path you are creating, so that is the one I read.',
              },
            ],
            { stage: 'hand' },
            1300,
          );
        },

        pickHand(hand) {
          if (get().stage !== 'hand' || get().typing) return;
          user(hand === 'right' ? 'My right hand' : 'My left hand');
          set({ hand, stage: 'wait' });
          auraSays(
            [
              {
                kind: 'camera',
                text: `Open your ${hand} hand in soft light, fingers relaxed. I will trace each line while you hold still.`,
              },
            ],
            { stage: 'camera' },
            1300,
          );
        },

        cameraDenied() {
          if (get().stage !== 'camera' || get().typing) return;
          auraSays([{ kind: 'cameraDenied' }], {}, 700);
        },

        chooseSamplePhoto() {
          // Resolve the denied bubble; the screen then opens the scan with palm.png.
          set((s) => ({
            items: s.items.map((m) => (m.kind === 'cameraDenied' ? { ...m, resolved: true } : m)),
          }));
        },

        sendScanToAura() {
          if (get().stage !== 'camera') return;
          set((s) => ({
            stage: 'wait',
            items: s.items.map((m) => (m.kind === 'cameraDenied' ? { ...m, resolved: true } : m)),
          }));
          push({ kind: 'photo' });
          auraSays(
            [
              { kind: 'aura', text: 'I can see your hand clearly, Sofia. Let us begin where love begins.' },
              { kind: 'line', index: 0 },
            ],
            { stage: 'line', lineIndex: 0, contextLine: 'heart' },
            1700,
          );
        },

        nextLine() {
          const s = get();
          if (s.typing || s.stage !== 'line') return;
          if (s.lineIndex >= LINES.length - 1) {
            user('Reveal my archetype');
            set({ stage: 'wait' });
            auraSays(
              [
                { kind: 'ready' },
                { kind: 'aura', text: 'This is your love palm. Ask me anything about it. Pick a line below and I will answer from it.' },
              ],
              { stage: 'free', contextLine: 'heart' },
              1800,
            );
            return;
          }
          const lineIndex = s.lineIndex + 1;
          user('Next line');
          set({ stage: 'wait' });
          auraSays([{ kind: 'line', index: lineIndex }], { stage: 'line', lineIndex, contextLine: LINES[lineIndex].id }, 1300);
        },

        ask(raw) {
          const text = raw.trim();
          const s = get();
          if (!text || s.typing || s.stage === 'wait') return false;
          const reading = isReadingStage(s);
          if (reading && questionsLeft(s) <= 0) return false;

          user(text);
          const used = s.questionsUsed + (reading ? 1 : 0);
          set({ questionsUsed: used });

          const answer = reading ? reply(text, s.contextLine) : replyBeforeReading(text);
          const extra: NewChatItem[] = [];
          const patch: Partial<AuralyData> = {};
          if (s.stage === 'free' && !s.reminderShown) {
            extra.push({ kind: 'remind' });
            patch.reminderShown = true;
          }
          if (reading && used >= questionLimit(s)) extra.push({ kind: 'upsell', pack: s.extraPacks });
          auraSays([{ kind: 'aura', text: answer }, ...extra], patch, 1500);
          return true;
        },

        askAbout(id) {
          if (get().stage !== 'free') return;
          const l = lineById(id);
          // A reply still "typing" lands first, so this prompt is never dropped.
          if (get().typing) get().flushPending();
          set({ contextLine: id });
          auraSays(
            [
              {
                kind: 'aura',
                text: `Let us talk about your ${l.name.toLowerCase()}, ${l.theme.toLowerCase()}. What would you like to understand?`,
              },
            ],
            {},
            900,
          );
        },

        setContextLine(id) {
          set({ contextLine: id });
        },

        buyMoreQuestions() {
          const s = get();
          const last = [...s.items].reverse().find((m) => m.kind === 'upsell');
          if (!last || last.kind !== 'upsell' || s.extraPacks > last.pack || s.typing) return;
          if (!charge(PRICE.questionsPack, 'questions')) return;
          set({ extraPacks: s.extraPacks + 1 });
          auraSays([{ kind: 'aura', text: 'Done. Ten more questions are yours. What else is on your heart?' }], {}, 900);
        },

        declineCredits(itemId) {
          const item = get().items.find((m) => m.id === itemId);
          if (get().typing || !item || item.kind !== 'noCredits' || item.resolved) return;
          set((s) => ({ items: s.items.map((m) => (m.id === itemId && m.kind === 'noCredits' ? { ...m, resolved: true } : m)) }));
          user('Maybe later');
          auraSays([{ kind: 'aura', text: 'Of course. Your palm will still be here when you are ready.' }], {}, 900);
        },

        toggleReminder() {
          set((s) => ({ reminderOn: !s.reminderOn }));
        },

        setCredits(n) {
          set({ credits: Math.max(0, Math.round(n)) });
        },

        setDemoFlag(flag, value) {
          set((s) => ({ demo: { ...s.demo, [flag]: value } }));
        },

        resetReading() {
          clearTimeout(timer);
          set({ ...initialData(), credits: get().credits, demo: get().demo, typing: false });
        },
      };
    },
    {
      name: 'auraly-love-palm',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): AuralyData => ({
        credits: s.credits,
        stage: s.stage,
        hand: s.hand,
        items: s.items,
        paid: s.paid,
        lineIndex: s.lineIndex,
        contextLine: s.contextLine,
        questionsUsed: s.questionsUsed,
        extraPacks: s.extraPacks,
        reminderOn: s.reminderOn,
        reminderShown: s.reminderShown,
        pending: s.pending,
        demo: s.demo,
      }),
      onRehydrateStorage: () => (state) => {
        // A reply that was "typing" when the app closed is delivered right away.
        state?.flushPending();
        useAuraly.setState({ hydrated: true });
      },
    },
  ),
);

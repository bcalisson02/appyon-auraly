import type { Hand, LineId } from '../data/lines';

export type Stage = 'offer' | 'wait' | 'hand' | 'camera' | 'line' | 'free';

/** Everything that can appear in the Master Aura thread. */
export type ChatItem =
  | { id: string; kind: 'aura'; text: string }
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'offer' }
  | { id: string; kind: 'camera'; text: string }
  | { id: string; kind: 'cameraDenied'; resolved?: boolean }
  | { id: string; kind: 'photo' }
  | { id: string; kind: 'line'; index: number }
  | { id: string; kind: 'ready' }
  | { id: string; kind: 'remind' }
  | { id: string; kind: 'upsell'; pack: number }
  | { id: string; kind: 'noCredits'; product: 'reading' | 'questions'; need: number; have: number; resolved?: boolean };

export type ChatItemKind = ChatItem['kind'];

/** A ChatItem before it gets an id. */
export type NewChatItem = ChatItem extends infer T ? (T extends ChatItem ? Omit<T, 'id'> : never) : never;

export interface DemoFlags {
  /** Next scan never aligns (edge case: hand not detected). */
  handNotDetected: boolean;
  /** Treat the camera permission as denied (useful on web). */
  cameraDenied: boolean;
}

export interface PendingReply {
  token: number;
  items: NewChatItem[];
  patch: Partial<AuralyData>;
}

/** Serializable state (persisted). */
export interface AuralyData {
  credits: number;
  stage: Stage;
  hand: Hand;
  items: ChatItem[];
  paid: boolean;
  lineIndex: number;
  contextLine: LineId;
  questionsUsed: number;
  extraPacks: number;
  reminderOn: boolean;
  reminderShown: boolean;
  /** A mocked Aura reply that is "being typed". Persisted so a reload never strands the chat. */
  pending: PendingReply | null;
  demo: DemoFlags;
}

export interface AuralyActions {
  startReading(): void;
  pickHand(hand: Hand): void;
  cameraDenied(): void;
  chooseSamplePhoto(): void;
  sendScanToAura(): void;
  nextLine(): void;
  /** Returns false when the question was not accepted (Aura typing, limit reached…). */
  ask(text: string): boolean;
  askAbout(id: LineId): void;
  setContextLine(id: LineId): void;
  buyMoreQuestions(): void;
  declineCredits(itemId: string): void;
  toggleReminder(): void;
  /* demo controls */
  setCredits(n: number): void;
  setDemoFlag(flag: keyof DemoFlags, value: boolean): void;
  resetReading(): void;
  /* internal */
  flushPending(token?: number): void;
}

export interface AuralyState extends AuralyData, AuralyActions {
  /** True while Aura is "typing" (derived from `pending`, kept for convenience). */
  typing: boolean;
  hydrated: boolean;
}

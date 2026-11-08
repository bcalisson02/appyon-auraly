/**
 * Mocked Master Aura. Keyword table ported verbatim from prototype/palm-data.js.
 * No real AI: the first matching regex wins, else a line-specific fallback.
 */
import { lineById, type LineId } from './lines';

const TABLE: readonly [RegExp, string][] = [
  [
    /meet|when|soon|future|soulmate/,
    "Palmistry doesn't give dates, Sofia. Your fate line deepens right after your head line, which I read as a season rather than a day: the bond that lasts tends to come once you've chosen yourself first. Does that feel like the season you're in?",
  ],
  [
    /curve|curved|heart line/,
    'A curved heart line belongs to people who love expressively. You show affection openly and you notice the small things. The curve ends between two fingers, which balances idealism with realism. You dream about love, but you also see people clearly.',
  ],
  [
    /give too much|too much|giving/,
    "Your heart line is long and deep, so giving comes naturally. The question is not whether to give less, but whether you're receiving too. Try this tonight: write down one thing you need and haven't asked for.",
  ],
  [
    /first impression|trust|intuition|instinct/,
    'Yes. Your head line slopes toward the Moon mount, the area of intuition. You read people quickly. Where you get lost is when you talk yourself out of what you felt in the first five minutes.',
  ],
  [
    /overthink|text|anxious/,
    "A sloping head line imagines a lot. That's your creativity, and also why silence feels loud to you. When a text is unanswered, ask: what do I actually know, and what am I filling in?",
  ],
  [
    /distance|far|long distance/,
    'Your life line arcs wide, so you recharge through presence. In distance, create small rituals: a voice note in the morning, a shared song at night. Your energy needs touchpoints, not grand gestures.',
  ],
  [
    /drain|tired|energy/,
    'Relationships that are unclear drain you most. Your palm shows steady energy when you know where you stand. Clarity is a form of rest for you.',
  ],
  [
    /spark|romance|passion/,
    'Your Venus mount is full, so novelty and beauty feed your love. Plan something sensory: a new place, music, a slow dinner. For you, romance is a language, and it needs practice.',
  ],
  [
    /two lines|relationship lines|deeper line|bond/,
    'Two relationship lines often mark two people who changed how you love. They are not a count of partners. The deeper line is the one that feels most lasting, and it may not have arrived yet.',
  ],
  [
    /partner|compatib|him|her|match/,
    'Someone with a straight, steady heart line would balance you: calm where you are intense. If they scan their palm, I can compare your lines side by side.',
  ],
  [
    /season|now|ready/,
    "From what you've shared, you're closer than you think. Your lines point to a time of choosing yourself, and that is usually what comes right before love feels easy.",
  ],
  [
    /what is palm|palmistry|how does/,
    "Palmistry reads the lines and mounts of your hand as a map of temperament. I trace four main lines, then interpret them for love. It's a mirror for reflection, not a fixed fate.",
  ],
];

/** Answer a question about the reading, using `context` for the fallback. */
export function reply(text: string, context: LineId): string {
  const t = text.toLowerCase();
  for (const [re, answer] of TABLE) if (re.test(t)) return answer;
  const l = lineById(context);
  return `Looking at your ${l.name.toLowerCase()}, ${l.body.charAt(0).toLowerCase()}${l.body.slice(1)} What made you ask about this today?`;
}

/** Answer before the reading is bought (stage 'offer'). Does not count against the limit. */
export function replyBeforeReading(text: string): string {
  if (/what is|palmistry|how/i.test(text)) return reply('what is palmistry', 'heart');
  return 'Think of it as a mirror rather than a prediction. Most women tell me it feels surprisingly close to how they love. Shall we look at your hand?';
}

/** Random "thinking" delay for the mocked AI, 900–1800 ms. */
export function thinkingDelay(): number {
  return 900 + Math.round(Math.random() * 900);
}

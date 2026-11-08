/**
 * Palm line content and geometry, ported from prototype/palm-data.js (LINES, CORE)
 * and the prototype script (ART, LBL, PATHS, HAND). All coordinates live in a
 * 300×400 viewBox that maps onto palm.png (a RIGHT palm, thumb on the right).
 */
import { img } from '../assets';
import { lineColors } from '../theme';

export type LineId = 'heart' | 'head' | 'life' | 'fate';
export type Hand = 'right' | 'left';

export interface PalmLine {
  id: LineId;
  name: string;
  /** Short name used by the line selector ("Heart"). */
  short: string;
  theme: string;
  color: string;
  seen: string;
  body: string;
  asks: [string, string];
  roman: 'I' | 'II' | 'III' | 'IV';
  /** Short descriptor used on the full reading ("Heart Line · Curved"). */
  value: string;
  art: number;
  /** Vertical focus of the art inside its header (0 = top, 1 = bottom). */
  artFocus: number;
}

export const LINES: readonly PalmLine[] = [
  {
    id: 'heart',
    name: 'Heart Line',
    short: 'Heart',
    theme: 'How you love',
    color: lineColors.heart,
    seen: 'Long, gently curved, ending between index and middle finger',
    body: 'You love with warmth and loyalty. Once you commit, you give fully, and sometimes you stay longer than you should where you are not met halfway.',
    asks: ['Why is my heart line curved?', 'Do I give too much in love?'],
    roman: 'I',
    value: 'Curved',
    art: img.handsGlow,
    artFocus: 0.42,
  },
  {
    id: 'head',
    name: 'Head Line',
    short: 'Head',
    theme: 'How you choose',
    color: lineColors.head,
    seen: 'Clear, sloping gently toward the Moon mount',
    body: 'You choose with intuition first and logic second. In love you sense compatibility early, and that first impression has rarely failed you.',
    asks: ['Should I trust my first impressions?', 'Why do I overthink texts?'],
    roman: 'II',
    value: 'Sloping',
    art: img.orbFigure,
    artFocus: 0.26,
  },
  {
    id: 'life',
    name: 'Life Line',
    short: 'Life',
    theme: 'Your emotional energy',
    color: lineColors.life,
    seen: 'A wide arc around the base of the thumb',
    body: 'A wide curve points to generous emotional energy. You recharge through closeness and touch, so distance affects you more than you show.',
    asks: ['How do I handle distance?', 'What drains my energy in love?'],
    roman: 'III',
    value: 'Wide arc',
    art: img.sphere,
    artFocus: 0.45,
  },
  {
    id: 'fate',
    name: 'Fate Line',
    short: 'Fate',
    theme: 'Where love is leading',
    color: lineColors.fate,
    seen: 'Rises from the wrist and grows stronger past the head line',
    body: 'Your fate line strengthens in the middle of the palm. Read it as a season: the bond that lasts tends to arrive after you have chosen yourself first.',
    asks: ['When will I meet someone?', 'Am I in that season now?'],
    roman: 'IV',
    value: 'Rising',
    art: img.starWoman,
    artFocus: 0.16,
  },
];

export const LINE_IDS: readonly LineId[] = LINES.map((l) => l.id);

export function lineById(id: LineId): PalmLine {
  return LINES.find((l) => l.id === id) ?? LINES[0];
}

export const ARCHETYPE = {
  name: 'The Devoted',
  accent: 'Flame',
  full: 'The Devoted Flame',
  headline: 'You love deeply and choose by instinct.',
  body: 'A warm, loyal heart guided by strong intuition. The work ahead is letting yourself receive as much as you give.',
} as const;

/* ---------- Geometry (viewBox 300×400) ---------- */

export const VIEWBOX = { w: 300, h: 400 } as const;

/** Traced line paths over palm.png. */
export const PATHS: Record<LineId, string> = {
  heart: 'M64 214 C96 206 130 204 152 194 C162 189 167 182 168 174',
  head: 'M216 230 C180 232 140 240 112 252 C98 258 88 263 80 268',
  life: 'M214 232 C196 252 188 280 189 308 C190 326 194 338 200 350',
  fate: 'M154 354 C150 330 151 300 148 276 C146 262 143 250 144 238',
};

/** Path lengths (sampled from the béziers, +2 margin) for stroke-dash drawing. */
export const PATH_LENGTH: Record<LineId, number> = { heart: 120, head: 145, life: 128, fate: 119 };

export interface LabelAnchor {
  /** Point on the line. */
  ax: number;
  ay: number;
  /** Label pill edge (x) and vertical center (y). */
  lx: number;
  ly: number;
  side: 'l' | 'r';
}

export const LBL: Record<LineId, LabelAnchor> = {
  heart: { ax: 160, ay: 190, lx: 290, ly: 112, side: 'r' },
  head: { ax: 96, ay: 258, lx: 6, ly: 326, side: 'l' },
  life: { ax: 193, ay: 292, lx: 292, ly: 330, side: 'r' },
  fate: { ax: 148, ay: 318, lx: 292, ly: 376, side: 'r' },
};

/** Mirror a label anchor for the left hand (x → 300 − x, side l↔r). */
export function labelFor(id: LineId, hand: Hand): LabelAnchor {
  const L = LBL[id];
  if (hand === 'right') return L;
  return { ax: VIEWBOX.w - L.ax, ay: L.ay, lx: VIEWBOX.w - L.lx, ly: L.ly, side: L.side === 'l' ? 'r' : 'l' };
}

/** Hand-shaped guide outline shown while aligning the palm. */
export const HAND_OUTLINE =
  'M75 400 L74 362 C62 332 52 290 47 245 L22 125 C18 106 22 90 30 88 C38 86 44 94 46 104 L70 192 L62 52 C61 38 68 32 75 32 C83 32 89 38 89 50 L104 166 L111 30 C111 18 118 16 125 16 C133 16 140 20 140 32 L150 168 L176 48 C178 38 184 34 191 35 C199 36 204 44 203 54 L204 214 C210 226 220 230 230 220 L268 162 C274 152 282 148 286 152 C290 158 288 170 284 182 C274 214 258 250 236 282 C220 306 206 330 200 352 L196 400';

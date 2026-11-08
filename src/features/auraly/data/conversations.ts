/** Mocked past conversations with Master Aura (read-only transcripts). */
import { img } from '../assets';

export interface PastMessage {
  from: 'aura' | 'user';
  text: string;
}

export interface PastConversation {
  id: string;
  title: string;
  date: string;
  preview: string;
  art: number;
  artFocus: number;
  messages: PastMessage[];
}

export const PAST_CONVERSATIONS: readonly PastConversation[] = [
  {
    id: 'venus-in-scorpio',
    title: 'Venus in Scorpio',
    date: 'Nov 2',
    preview: 'Your Venus asks for depth before trust. That is not coldness, it is care.',
    art: img.bgWaves,
    artFocus: 0.3,
    messages: [
      { from: 'user', text: 'Why do I take so long to open up to someone new?' },
      { from: 'aura', text: 'Your Venus sits in Scorpio, Sofia. It loves in depth, and depth takes time to test.' },
      { from: 'user', text: 'People say I seem cold at first.' },
      { from: 'aura', text: 'Your Venus asks for depth before trust. That is not coldness, it is care.' },
      { from: 'user', text: 'How do I let someone in faster?' },
      { from: 'aura', text: 'Not faster. Clearer. Tell them you warm slowly, and watch who is happy to wait.' },
    ],
  },
  {
    id: 'open-door-dream',
    title: 'The open door dream',
    date: 'Oct 28',
    preview: 'A door left open in a dream often points to a choice you have not named yet.',
    art: img.window,
    artFocus: 0.3,
    messages: [
      { from: 'user', text: 'I keep dreaming about a door left open at night.' },
      { from: 'aura', text: 'Tell me more. Are you inside the room, or outside looking in?' },
      { from: 'user', text: 'Inside. I never close it, I just watch it.' },
      { from: 'aura', text: 'Watching means you have noticed something you are not ready to act on.' },
      { from: 'user', text: 'Like what?' },
      { from: 'aura', text: 'A door left open in a dream often points to a choice you have not named yet.' },
      { from: 'user', text: 'Maybe the job offer.' },
      { from: 'aura', text: 'Then name it out loud this week. Dreams quiet down once the choice is spoken.' },
      { from: 'user', text: 'I will try.' },
    ],
  },
  {
    id: 'compatibility-leo',
    title: 'Compatibility with Leo',
    date: 'Oct 21',
    preview: 'Your Libra air feeds his Leo fire. Notice who leads and who follows.',
    art: img.holding,
    artFocus: 0.6,
    messages: [
      { from: 'user', text: 'Are Libra and Leo a good match?' },
      { from: 'aura', text: 'Your Libra air feeds his Leo fire. Notice who leads and who follows.' },
      { from: 'user', text: 'He always leads.' },
      { from: 'aura', text: 'Then let him lead the plans, and you lead the conversations. Balance is your gift.' },
    ],
  },
];

export function pastConversationById(id: string): PastConversation | undefined {
  return PAST_CONVERSATIONS.find((c) => c.id === id);
}

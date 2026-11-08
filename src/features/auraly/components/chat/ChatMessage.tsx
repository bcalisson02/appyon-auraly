import { memo } from 'react';
import Animated from 'react-native-reanimated';

import type { ChatItem } from '../../store';
import {
  ArchetypeCard,
  AuraBubble,
  CameraBubble,
  CameraDeniedBubble,
  LineCard,
  NoCreditsBubble,
  OfferCard,
  PhotoMessage,
  RemindBubble,
  UpsellCard,
  UserBubble,
} from './messages';

/**
 * Message enter: fade + translateY 4 → 0 (Reanimated CSS animation, runs once on mount).
 * Layout `entering` animations are avoided on purpose: on web they position the
 * wrapper absolutely, which breaks flow inside a ScrollView.
 */
const enterKeyframes = {
  from: { opacity: 0, transform: [{ translateY: 4 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
};

/** Everything a message may need from the screen. */
export interface ChatContext {
  credits: number;
  paid: boolean;
  hand: 'right' | 'left';
  cameraActive: boolean;
  currentLine: number | null;
  extraPacks: number;
  reminderOn: boolean;
  onBuyReading(): void;
  onOpenCamera(): void;
  onAllowCamera(): void;
  onSamplePhoto(): void;
  onNextLine(): void;
  onOpenReading(): void;
  onToggleReminder(): void;
  onBuyQuestions(): void;
  onGetCredits(): void;
  onDeclineCredits(id: string): void;
}

function Message({ item, ctx }: { item: ChatItem; ctx: ChatContext }) {
  switch (item.kind) {
    case 'aura':
      return <AuraBubble text={item.text} />;
    case 'user':
      return <UserBubble text={item.text} />;
    case 'offer':
      return <OfferCard paid={ctx.paid} credits={ctx.credits} onBuy={ctx.onBuyReading} />;
    case 'camera':
      return <CameraBubble text={item.text} active={ctx.cameraActive} onOpen={ctx.onOpenCamera} />;
    case 'cameraDenied':
      return <CameraDeniedBubble active={ctx.cameraActive && !item.resolved} onAllow={ctx.onAllowCamera} onSample={ctx.onSamplePhoto} />;
    case 'photo':
      return <PhotoMessage hand={ctx.hand} />;
    case 'line':
      return <LineCard index={item.index} current={ctx.currentLine === item.index} onNext={ctx.onNextLine} />;
    case 'ready':
      return <ArchetypeCard onOpen={ctx.onOpenReading} />;
    case 'remind':
      return <RemindBubble on={ctx.reminderOn} onToggle={ctx.onToggleReminder} />;
    case 'upsell':
      return <UpsellCard purchased={ctx.extraPacks > item.pack} onBuy={ctx.onBuyQuestions} />;
    case 'noCredits':
      return (
        <NoCreditsBubble
          product={item.product}
          need={item.need}
          have={item.have}
          active={!item.resolved}
          onGetCredits={ctx.onGetCredits}
          onLater={() => ctx.onDeclineCredits(item.id)}
        />
      );
  }
}

const BIG = new Set<ChatItem['kind']>(['offer', 'line', 'ready', 'upsell']);

/** `animate` is false for items that were already in the thread when the chat opened. */
export const ChatMessage = memo(function ChatMessage({ item, ctx, animate }: { item: ChatItem; ctx: ChatContext; animate: boolean }) {
  const duration = BIG.has(item.kind) ? '500ms' : item.kind === 'user' ? '300ms' : '400ms';
  return (
    <Animated.View
      style={[
        BIG.has(item.kind) ? { alignSelf: 'stretch' } : undefined,
        animate ? { animationName: enterKeyframes, animationDuration: duration, animationTimingFunction: 'ease' } : undefined,
      ]}
    >
      <Message item={item} ctx={ctx} />
    </Animated.View>
  );
});

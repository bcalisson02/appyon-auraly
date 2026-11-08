/**
 * Static image registry. Same artwork as the handoff's prototype/assets, re-encoded
 * as WebP (max 1000 px wide) to cut the bundle from 19 MB to ~2 MB.
 */
export const img = {
  masterAura: require('@/assets/auraly/master-aura.webp'),
  devotedFlame: require('@/assets/auraly/art-devoted-flame.webp'),
  handsRing: require('@/assets/auraly/art-hands-ring.webp'),
  handsGlow: require('@/assets/auraly/art-hands-glow.webp'),
  orbFigure: require('@/assets/auraly/art-orb-figure.webp'),
  sphere: require('@/assets/auraly/art-sphere.webp'),
  starWoman: require('@/assets/auraly/art-star-woman.webp'),
  gift: require('@/assets/auraly/art-gift.webp'),
  holding: require('@/assets/auraly/art-holding.webp'),
  window: require('@/assets/auraly/art-window.webp'),
  writing: require('@/assets/auraly/art-writing.webp'),
  bgClouds: require('@/assets/auraly/bg-clouds.webp'),
  bgSwirl: require('@/assets/auraly/bg-swirl.webp'),
  bgWaves: require('@/assets/auraly/bg-waves.webp'),
  orb: require('@/assets/auraly/orb.webp'),
  palm: require('@/assets/auraly/palm.webp'),
} as const;

export type ImageKey = keyof typeof img;

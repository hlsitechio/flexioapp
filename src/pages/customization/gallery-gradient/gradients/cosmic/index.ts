export const cosmicGradient = {
  id: 'cosmic',
  name: 'Cosmic Dust',
  class: 'relative overflow-hidden glassmorphic-cosmic',
  style: {
    background: `
      radial-gradient(ellipse 40% 80% at 90% 10%, hsl(260 60% 70% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 90% 40% at 10% 90%, hsl(320 50% 65% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 60% 70% at 70% 60%, hsl(280 55% 60% / 0.15) 0%, transparent 50%),
      conic-gradient(from 45deg at 30% 70%, hsl(260 40% 85% / 0.1) 0deg, hsl(280 45% 80% / 0.15) 90deg, hsl(320 40% 85% / 0.1) 180deg, hsl(260 40% 85% / 0.1) 270deg),
      linear-gradient(135deg, hsl(250 30% 90% / 0.08) 0%, hsl(280 35% 85% / 0.12) 50%, hsl(320 30% 90% / 0.08) 100%)
    `,
    backdropFilter: 'blur(25px) saturate(150%)',
    border: '1px solid hsl(280 50% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(280 50% 30% / 0.12),
      inset 0 1px 0 hsl(280 60% 95% / 0.2),
      inset 0 -1px 0 hsl(280 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 40% 80% at 90% 10%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 90% 40% at 10% 90%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, rgba(243, 232, 255, 0.08) 0%, rgba(233, 213, 255, 0.12) 50%, rgba(251, 207, 232, 0.08) 100%)
  `
};
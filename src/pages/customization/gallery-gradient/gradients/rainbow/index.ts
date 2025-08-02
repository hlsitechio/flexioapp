export const rainbowGradient = {
  id: 'rainbow',
  name: 'Rainbow Spectrum',
  class: 'relative overflow-hidden glassmorphic-rainbow',
  style: {
    background: `
      conic-gradient(from 0deg at 50% 50%, hsl(0 40% 85% / 0.15) 0deg, hsl(60 50% 85% / 0.2) 60deg, hsl(120 45% 85% / 0.15) 120deg, hsl(180 50% 85% / 0.1) 180deg, hsl(240 45% 85% / 0.15) 240deg, hsl(300 50% 85% / 0.2) 300deg, hsl(0 40% 85% / 0.15) 360deg),
      radial-gradient(ellipse 70% 70% at 30% 30%, hsl(0 30% 90% / 0.08) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 70% 70%, hsl(240 35% 90% / 0.1) 0%, transparent 50%),
      linear-gradient(45deg, hsl(0 20% 95% / 0.05) 0%, hsl(120 25% 90% / 0.08) 50%, hsl(240 20% 95% / 0.05) 100%)
    `,
    backdropFilter: 'blur(25px) saturate(200%)',
    border: '1px solid hsl(300 50% 90% / 0.3)',
    boxShadow: `
      0 8px 32px hsl(300 40% 30% / 0.1),
      inset 0 1px 0 hsl(0 60% 98% / 0.3),
      inset 0 -1px 0 hsl(240 30% 80% / 0.1)
    `
  },
  preview: `
    conic-gradient(from 0deg at 50% 50%, rgba(254, 226, 226, 0.15) 0deg, rgba(254, 240, 138, 0.2) 60deg, rgba(187, 247, 208, 0.15) 120deg, rgba(186, 230, 253, 0.1) 180deg, rgba(196, 181, 253, 0.15) 240deg, rgba(253, 244, 255, 0.2) 300deg, rgba(254, 226, 226, 0.15) 360deg),
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(240, 253, 244, 0.08) 50%, rgba(248, 250, 252, 0.05) 100%)
  `
};
export const auroraGradient = {
  id: 'aurora',
  name: 'Aurora Borealis',
  class: 'relative overflow-hidden glassmorphic-aurora',
  style: {
    background: `
      radial-gradient(ellipse 100% 40% at 50% 0%, hsl(150 60% 70% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 70% 80% at 20% 100%, hsl(220 50% 60% / 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 90% 50%, hsl(280 55% 65% / 0.1) 0%, transparent 50%),
      linear-gradient(180deg, hsl(150 40% 90% / 0.08) 0%, hsl(220 35% 85% / 0.12) 30%, hsl(280 40% 85% / 0.1) 70%, hsl(150 30% 90% / 0.08) 100%),
      linear-gradient(90deg, transparent 0%, hsl(220 40% 80% / 0.05) 50%, transparent 100%)
    `,
    backdropFilter: 'blur(24px) saturate(170%)',
    border: '1px solid hsl(180 50% 90% / 0.2)',
    boxShadow: `
      0 8px 32px hsl(180 40% 30% / 0.1),
      inset 0 1px 0 hsl(150 60% 95% / 0.25),
      inset 0 -1px 0 hsl(220 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 100% 40% at 50% 0%, rgba(74, 222, 128, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse 70% 80% at 20% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, rgba(240, 253, 244, 0.08) 0%, rgba(219, 234, 254, 0.12) 30%, rgba(243, 232, 255, 0.1) 70%, rgba(240, 253, 244, 0.08) 100%)
  `
};
export const tropicalGradient = {
  id: 'tropical',
  name: 'Tropical Paradise',
  class: 'relative overflow-hidden glassmorphic-tropical',
  style: {
    background: `
      radial-gradient(ellipse 80% 70% at 20% 40%, hsl(120 60% 70% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 80% 20%, hsl(160 55% 65% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 90% 60% at 50% 90%, hsl(140 65% 75% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 70% 50% at 90% 70%, hsl(100 50% 70% / 0.15) 0%, transparent 50%),
      linear-gradient(225deg, hsl(120 40% 95% / 0.1) 0%, hsl(160 35% 90% / 0.15) 30%, hsl(140 40% 95% / 0.1) 70%, hsl(100 35% 95% / 0.08) 100%)
    `,
    backdropFilter: 'blur(20px) saturate(170%)',
    border: '1px solid hsl(140 50% 85% / 0.3)',
    boxShadow: `
      0 8px 32px hsl(140 50% 40% / 0.12),
      inset 0 1px 0 hsl(140 60% 95% / 0.25),
      inset 0 -1px 0 hsl(140 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 80% 70% at 20% 40%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 50%),
    linear-gradient(225deg, rgba(240, 253, 244, 0.1) 0%, rgba(209, 250, 229, 0.15) 30%, rgba(236, 253, 245, 0.1) 70%, rgba(247, 254, 231, 0.08) 100%)
  `
};
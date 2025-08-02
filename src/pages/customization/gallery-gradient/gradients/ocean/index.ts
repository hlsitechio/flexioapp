export const oceanGradient = {
  id: 'ocean',
  name: 'Ocean Depths',
  class: 'relative overflow-hidden glassmorphic-ocean',
  style: {
    background: `
      radial-gradient(ellipse 80% 50% at 20% 40%, hsl(210 80% 70% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 80% 70% at 90% 70%, hsl(190 70% 60% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 100% 60% at 50% 100%, hsl(220 60% 50% / 0.2) 0%, transparent 50%),
      linear-gradient(135deg, hsl(210 40% 85% / 0.1) 0%, hsl(190 30% 80% / 0.15) 50%, hsl(220 35% 75% / 0.1) 100%)
    `,
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid hsl(210 50% 90% / 0.2)',
    boxShadow: `
      0 8px 32px hsl(210 50% 30% / 0.1),
      inset 0 1px 0 hsl(210 70% 90% / 0.2),
      inset 0 -1px 0 hsl(210 30% 60% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(96, 165, 250, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 80% 70% at 90% 70%, rgba(6, 182, 212, 0.25) 0%, transparent 50%),
    linear-gradient(135deg, rgba(219, 234, 254, 0.1) 0%, rgba(186, 230, 253, 0.15) 50%, rgba(191, 219, 254, 0.1) 100%)
  `
};
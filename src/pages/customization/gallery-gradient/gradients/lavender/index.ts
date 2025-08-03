export const lavenderGradient = {
  id: 'lavender',
  name: 'Lavender Dream',
  class: 'relative overflow-hidden glassmorphic-lavender',
  style: {
    background: `
      radial-gradient(ellipse 80% 60% at 30% 20%, hsl(280 70% 75% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 90% at 80% 80%, hsl(260 60% 70% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 90% 50% at 10% 60%, hsl(240 65% 75% / 0.2) 0%, transparent 50%),
      conic-gradient(from 30deg at 70% 40%, hsl(280 40% 90% / 0.1) 0deg, hsl(260 45% 85% / 0.15) 120deg, hsl(240 40% 90% / 0.1) 240deg),
      linear-gradient(135deg, hsl(280 30% 95% / 0.08) 0%, hsl(260 35% 90% / 0.12) 50%, hsl(240 30% 95% / 0.08) 100%)
    `,
    backdropFilter: 'blur(22px) saturate(160%)',
    border: '1px solid hsl(270 50% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(270 50% 40% / 0.12),
      inset 0 1px 0 hsl(270 60% 95% / 0.25),
      inset 0 -1px 0 hsl(270 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 80% 60% at 30% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 90% at 80% 80%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
    linear-gradient(135deg, rgba(250, 245, 255, 0.08) 0%, rgba(243, 232, 255, 0.12) 50%, rgba(237, 233, 254, 0.08) 100%)
  `
};
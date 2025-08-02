export const sunsetGradient = {
  id: 'sunset',
  name: 'Sunset Glow',
  class: 'relative overflow-hidden glassmorphic-sunset',
  style: {
    background: `
      radial-gradient(ellipse 100% 50% at 50% 100%, hsl(25 60% 65% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 90% 30%, hsl(350 50% 60% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 10% 70%, hsl(320 55% 65% / 0.15) 0%, transparent 50%),
      linear-gradient(90deg, hsl(25 30% 90% / 0.08) 0%, hsl(350 35% 85% / 0.12) 50%, hsl(320 30% 90% / 0.08) 100%)
    `,
    backdropFilter: 'blur(20px) saturate(160%)',
    border: '1px solid hsl(25 60% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(25 50% 40% / 0.12),
      inset 0 1px 0 hsl(25 70% 95% / 0.25),
      inset 0 -1px 0 hsl(350 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 100% 50% at 50% 100%, rgba(251, 146, 60, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 90% 30%, rgba(244, 63, 94, 0.2) 0%, transparent 50%),
    linear-gradient(90deg, rgba(254, 226, 226, 0.08) 0%, rgba(254, 205, 211, 0.12) 50%, rgba(253, 244, 255, 0.08) 100%)
  `
};
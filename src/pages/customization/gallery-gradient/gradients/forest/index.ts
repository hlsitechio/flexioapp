export const forestGradient = {
  id: 'forest',
  name: 'Forest Mist',
  class: 'relative overflow-hidden glassmorphic-forest',
  style: {
    background: `
      radial-gradient(ellipse 70% 60% at 30% 20%, hsl(150 50% 65% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 90% 80% at 80% 80%, hsl(170 45% 55% / 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 60% 100% at 60% 0%, hsl(160 55% 60% / 0.1) 0%, transparent 50%),
      linear-gradient(225deg, hsl(150 30% 90% / 0.08) 0%, hsl(160 35% 85% / 0.12) 50%, hsl(170 30% 90% / 0.08) 100%)
    `,
    backdropFilter: 'blur(18px) saturate(140%)',
    border: '1px solid hsl(160 50% 90% / 0.2)',
    boxShadow: `
      0 8px 32px hsl(160 40% 30% / 0.1),
      inset 0 1px 0 hsl(150 60% 95% / 0.2),
      inset 0 -1px 0 hsl(170 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 70% 60% at 30% 20%, rgba(52, 211, 153, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse 90% 80% at 80% 80%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
    linear-gradient(225deg, rgba(240, 253, 244, 0.08) 0%, rgba(209, 250, 229, 0.12) 50%, rgba(204, 251, 241, 0.08) 100%)
  `
};
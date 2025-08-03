export const roseGradient = {
  id: 'rose',
  name: 'Rose Garden',
  class: 'relative overflow-hidden glassmorphic-rose',
  style: {
    background: `
      radial-gradient(ellipse 70% 80% at 20% 30%, hsl(350 70% 75% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 80% 20%, hsl(330 65% 70% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 90% 70% at 50% 90%, hsl(320 60% 75% / 0.2) 0%, transparent 50%),
      conic-gradient(from 180deg at 60% 30%, hsl(350 40% 90% / 0.1) 0deg, hsl(330 45% 85% / 0.15) 72deg, hsl(320 40% 90% / 0.1) 144deg, hsl(350 35% 90% / 0.08) 216deg),
      linear-gradient(225deg, hsl(350 30% 95% / 0.08) 0%, hsl(330 35% 90% / 0.12) 50%, hsl(320 30% 95% / 0.08) 100%)
    `,
    backdropFilter: 'blur(20px) saturate(170%)',
    border: '1px solid hsl(340 50% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(340 50% 40% / 0.12),
      inset 0 1px 0 hsl(340 60% 95% / 0.25),
      inset 0 -1px 0 hsl(340 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 70% 80% at 20% 30%, rgba(244, 63, 94, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 80% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
    linear-gradient(225deg, rgba(255, 241, 242, 0.08) 0%, rgba(252, 231, 243, 0.12) 50%, rgba(253, 242, 248, 0.08) 100%)
  `
};
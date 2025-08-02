export const neonGradient = {
  id: 'neon',
  name: 'Neon Nights',
  class: 'relative overflow-hidden glassmorphic-neon',
  style: {
    background: `
      radial-gradient(ellipse 50% 80% at 20% 40%, hsl(190 60% 75% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 80% 50% at 80% 60%, hsl(300 50% 70% / 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 60% 90% at 50% 10%, hsl(270 55% 65% / 0.1) 0%, transparent 50%),
      conic-gradient(from 270deg at 70% 30%, hsl(190 40% 85% / 0.08) 0deg, hsl(270 45% 80% / 0.12) 120deg, hsl(300 40% 85% / 0.08) 240deg, hsl(190 40% 85% / 0.08) 360deg),
      linear-gradient(90deg, hsl(190 30% 90% / 0.06) 0%, hsl(270 35% 85% / 0.1) 50%, hsl(300 30% 90% / 0.06) 100%)
    `,
    backdropFilter: 'blur(22px) saturate(160%)',
    border: '1px solid hsl(270 50% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(270 40% 30% / 0.1),
      inset 0 1px 0 hsl(190 60% 95% / 0.2),
      inset 0 -1px 0 hsl(300 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 50% 80% at 20% 40%, rgba(34, 211, 238, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse 80% 50% at 80% 60%, rgba(217, 70, 239, 0.15) 0%, transparent 50%),
    linear-gradient(90deg, rgba(236, 254, 255, 0.06) 0%, rgba(243, 232, 255, 0.1) 50%, rgba(253, 244, 255, 0.06) 100%)
  `
};
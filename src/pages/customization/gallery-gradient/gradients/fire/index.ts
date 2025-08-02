export const fireGradient = {
  id: 'fire',
  name: 'Fire Storm',
  class: 'relative overflow-hidden glassmorphic-fire',
  style: {
    background: `
      radial-gradient(ellipse 60% 80% at 80% 20%, hsl(15 70% 65% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 70% 60% at 20% 80%, hsl(25 60% 60% / 0.25) 0%, transparent 50%),
      conic-gradient(from 180deg at 50% 50%, hsl(45 50% 85% / 0.2) 0deg, hsl(15 60% 80% / 0.15) 120deg, hsl(5 50% 75% / 0.1) 240deg, hsl(45 50% 85% / 0.2) 360deg),
      linear-gradient(45deg, hsl(5 30% 90% / 0.1) 0%, hsl(25 40% 85% / 0.15) 50%, hsl(45 50% 90% / 0.1) 100%)
    `,
    backdropFilter: 'blur(20px) saturate(200%)',
    border: '1px solid hsl(25 60% 90% / 0.3)',
    boxShadow: `
      0 8px 32px hsl(15 60% 40% / 0.15),
      inset 0 1px 0 hsl(45 70% 95% / 0.3),
      inset 0 -1px 0 hsl(15 40% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 70% 60% at 20% 80%, rgba(249, 115, 22, 0.25) 0%, transparent 50%),
    linear-gradient(45deg, rgba(254, 226, 226, 0.1) 0%, rgba(254, 215, 170, 0.15) 50%, rgba(254, 240, 138, 0.1) 100%)
  `
};
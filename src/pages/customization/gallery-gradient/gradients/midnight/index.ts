export const midnightGradient = {
  id: 'midnight',
  name: 'Midnight Blues',
  class: 'relative overflow-hidden glassmorphic-midnight',
  style: {
    background: `
      radial-gradient(ellipse 70% 80% at 60% 40%, hsl(220 40% 20% / 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 20% 80%, hsl(240 35% 25% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 90% 70% at 90% 20%, hsl(260 30% 30% / 0.25) 0%, transparent 50%),
      conic-gradient(from 45deg at 60% 40%, hsl(220 20% 85% / 0.08) 0deg, hsl(240 25% 80% / 0.12) 72deg, hsl(260 20% 85% / 0.08) 144deg, hsl(220 15% 85% / 0.06) 216deg),
      linear-gradient(135deg, hsl(220 30% 90% / 0.06) 0%, hsl(240 25% 85% / 0.1) 50%, hsl(260 20% 90% / 0.06) 100%)
    `,
    backdropFilter: 'blur(25px) saturate(130%)',
    border: '1px solid hsl(230 30% 80% / 0.2)',
    boxShadow: `
      0 8px 32px hsl(230 40% 10% / 0.15),
      inset 0 1px 0 hsl(230 30% 90% / 0.15),
      inset 0 -1px 0 hsl(230 20% 50% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 70% 80% at 60% 40%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 20% 80%, rgba(49, 46, 129, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, rgba(226, 232, 240, 0.06) 0%, rgba(203, 213, 225, 0.1) 50%, rgba(226, 232, 240, 0.06) 100%)
  `
};
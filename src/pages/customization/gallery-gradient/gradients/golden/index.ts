export const goldenGradient = {
  id: 'golden',
  name: 'Golden Hour',
  class: 'relative overflow-hidden glassmorphic-golden',
  style: {
    background: `
      radial-gradient(ellipse 90% 60% at 70% 10%, hsl(45 80% 70% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 70% 80% at 20% 90%, hsl(25 70% 65% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 60% 70% at 90% 70%, hsl(0 60% 70% / 0.2) 0%, transparent 50%),
      linear-gradient(45deg, hsl(45 40% 90% / 0.1) 0%, hsl(25 45% 85% / 0.15) 30%, hsl(0 40% 90% / 0.1) 70%, hsl(45 35% 90% / 0.08) 100%),
      conic-gradient(from 90deg at 40% 60%, hsl(45 30% 95% / 0.05) 0deg, hsl(25 35% 90% / 0.1) 90deg, hsl(0 30% 95% / 0.05) 180deg)
    `,
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid hsl(35 60% 90% / 0.3)',
    boxShadow: `
      0 8px 32px hsl(35 60% 40% / 0.15),
      inset 0 1px 0 hsl(45 70% 95% / 0.3),
      inset 0 -1px 0 hsl(25 40% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 90% 60% at 70% 10%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 70% 80% at 20% 90%, rgba(251, 146, 60, 0.25) 0%, transparent 50%),
    linear-gradient(45deg, rgba(255, 251, 235, 0.1) 0%, rgba(254, 215, 170, 0.15) 30%, rgba(254, 242, 242, 0.1) 70%, rgba(255, 251, 235, 0.08) 100%)
  `
};
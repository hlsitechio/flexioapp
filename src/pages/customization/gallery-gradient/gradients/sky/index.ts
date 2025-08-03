export const skyGradient = {
  id: 'sky',
  name: 'Sky Blue',
  class: 'relative overflow-hidden glassmorphic-sky',
  style: {
    background: `
      radial-gradient(ellipse 80% 50% at 30% 20%, hsl(200 80% 75% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 80% 60%, hsl(220 70% 70% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 90% 60% at 10% 80%, hsl(180 65% 75% / 0.2) 0%, transparent 50%),
      linear-gradient(180deg, hsl(200 40% 95% / 0.1) 0%, hsl(220 35% 90% / 0.15) 40%, hsl(180 40% 95% / 0.1) 80%, hsl(200 30% 95% / 0.08) 100%),
      radial-gradient(circle at 70% 30%, hsl(220 30% 90% / 0.05) 0%, transparent 40%)
    `,
    backdropFilter: 'blur(22px) saturate(160%)',
    border: '1px solid hsl(210 50% 90% / 0.25)',
    boxShadow: `
      0 8px 32px hsl(210 50% 40% / 0.1),
      inset 0 1px 0 hsl(200 60% 95% / 0.25),
      inset 0 -1px 0 hsl(220 30% 70% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 80% 50% at 30% 20%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 80% 60%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
    linear-gradient(180deg, rgba(240, 249, 255, 0.1) 0%, rgba(219, 234, 254, 0.15) 40%, rgba(240, 253, 250, 0.1) 80%, rgba(240, 249, 255, 0.08) 100%)
  `
};
export const stoneGradient = {
  id: 'stone',
  name: 'Stone Elegance',
  class: 'relative overflow-hidden glassmorphic-stone',
  style: {
    background: `
      radial-gradient(ellipse 70% 80% at 70% 30%, hsl(210 15% 75% / 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 20% 70%, hsl(200 10% 70% / 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 90% 70% at 80% 80%, hsl(220 12% 65% / 0.18) 0%, transparent 50%),
      conic-gradient(from 270deg at 70% 30%, hsl(210 8% 90% / 0.1) 0deg, hsl(200 12% 85% / 0.12) 60deg, hsl(220 10% 88% / 0.1) 120deg, hsl(210 8% 90% / 0.08) 180deg),
      linear-gradient(135deg, hsl(210 15% 95% / 0.08) 0%, hsl(200 12% 90% / 0.12) 50%, hsl(220 10% 95% / 0.08) 100%)
    `,
    backdropFilter: 'blur(18px) saturate(120%)',
    border: '1px solid hsl(210 15% 85% / 0.3)',
    boxShadow: `
      0 8px 32px hsl(210 15% 30% / 0.1),
      inset 0 1px 0 hsl(210 20% 95% / 0.25),
      inset 0 -1px 0 hsl(210 10% 60% / 0.1)
    `
  },
  preview: `
    radial-gradient(ellipse 70% 80% at 70% 30%, rgba(100, 116, 139, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 20% 70%, rgba(107, 114, 128, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, rgba(248, 250, 252, 0.08) 0%, rgba(241, 245, 249, 0.12) 50%, rgba(248, 250, 252, 0.08) 100%)
  `
};
export const auroraGradient = {
  id: 'aurora',
  name: 'Aurora Borealis',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 100% 40% at 50% 0%, hsl(150 100% 70%) 0%, transparent 50%),
      radial-gradient(ellipse 70% 80% at 20% 100%, hsl(220 100% 60%) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 90% 50%, hsl(280 100% 65%) 0%, transparent 50%),
      linear-gradient(180deg, hsl(150 100% 50%) 0%, hsl(220 100% 55%) 30%, hsl(280 100% 50%) 70%, hsl(150 100% 40%) 100%),
      linear-gradient(90deg, transparent 0%, hsl(220 100% 60% / 0.3) 50%, transparent 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 100% 40% at 50% 0%, #4ade80 0%, transparent 50%),
    radial-gradient(ellipse 70% 80% at 20% 100%, #3b82f6 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 90% 50%, #a855f7 0%, transparent 50%),
    linear-gradient(180deg, #22c55e 0%, #3b82f6 30%, #9333ea 70%, #16a34a 100%),
    linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)
  `
};
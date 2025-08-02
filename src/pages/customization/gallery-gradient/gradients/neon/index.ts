export const neonGradient = {
  id: 'neon',
  name: 'Neon Nights',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 50% 80% at 20% 40%, hsl(190 100% 75%) 0%, transparent 50%),
      radial-gradient(ellipse 80% 50% at 80% 60%, hsl(300 100% 70%) 0%, transparent 50%),
      radial-gradient(ellipse 60% 90% at 50% 10%, hsl(270 100% 65%) 0%, transparent 50%),
      conic-gradient(from 270deg at 70% 30%, hsl(190 100% 60%) 0deg, hsl(270 100% 60%) 120deg, hsl(300 100% 65%) 240deg, hsl(190 100% 60%) 360deg),
      linear-gradient(90deg, hsl(190 100% 55%) 0%, hsl(270 100% 55%) 50%, hsl(300 100% 60%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 50% 80% at 20% 40%, #22d3ee 0%, transparent 50%),
    radial-gradient(ellipse 80% 50% at 80% 60%, #d946ef 0%, transparent 50%),
    radial-gradient(ellipse 60% 90% at 50% 10%, #8b5cf6 0%, transparent 50%),
    conic-gradient(from 270deg at 70% 30%, #06b6d4 0deg, #8b5cf6 120deg, #d946ef 240deg, #06b6d4 360deg),
    linear-gradient(90deg, #0891b2 0%, #7c3aed 50%, #c026d3 100%)
  `
};
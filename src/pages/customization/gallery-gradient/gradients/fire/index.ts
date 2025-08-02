export const fireGradient = {
  id: 'fire',
  name: 'Fire Storm',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 60% 80% at 80% 20%, hsl(15 100% 65%) 0%, transparent 50%),
      radial-gradient(ellipse 70% 60% at 20% 80%, hsl(25 100% 60%) 0%, transparent 50%),
      conic-gradient(from 180deg at 50% 50%, hsl(45 100% 55%) 0deg, hsl(15 100% 55%) 120deg, hsl(5 100% 50%) 240deg, hsl(45 100% 55%) 360deg),
      linear-gradient(45deg, hsl(5 100% 50%) 0%, hsl(25 100% 55%) 50%, hsl(45 100% 60%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 60% 80% at 80% 20%, #ef4444 0%, transparent 50%),
    radial-gradient(ellipse 70% 60% at 20% 80%, #f97316 0%, transparent 50%),
    conic-gradient(from 180deg at 50% 50%, #facc15 0deg, #ef4444 120deg, #dc2626 240deg, #facc15 360deg),
    linear-gradient(45deg, #dc2626 0%, #f97316 50%, #fbbf24 100%)
  `
};
export const rainbowGradient = {
  id: 'rainbow',
  name: 'Rainbow Spectrum',
  class: 'relative overflow-hidden',
  style: {
    background: `
      conic-gradient(from 0deg at 50% 50%, hsl(0 100% 60%) 0deg, hsl(60 100% 60%) 60deg, hsl(120 100% 60%) 120deg, hsl(180 100% 60%) 180deg, hsl(240 100% 60%) 240deg, hsl(300 100% 60%) 300deg, hsl(0 100% 60%) 360deg),
      radial-gradient(ellipse 70% 70% at 30% 30%, hsl(0 100% 70% / 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 70% 70%, hsl(240 100% 70% / 0.3) 0%, transparent 50%),
      linear-gradient(45deg, hsl(0 100% 50% / 0.8) 0%, hsl(120 100% 50% / 0.8) 50%, hsl(240 100% 50% / 0.8) 100%)
    `
  },
  preview: `
    conic-gradient(from 0deg at 50% 50%, #f87171 0deg, #facc15 60deg, #4ade80 120deg, #60a5fa 180deg, #818cf8 240deg, #a855f7 300deg, #f87171 360deg),
    radial-gradient(ellipse 70% 70% at 30% 30%, rgba(248, 113, 113, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 70% 70%, rgba(129, 140, 248, 0.3) 0%, transparent 50%),
    linear-gradient(45deg, rgba(220, 38, 38, 0.8) 0%, rgba(34, 197, 94, 0.8) 50%, rgba(79, 70, 229, 0.8) 100%)
  `
};
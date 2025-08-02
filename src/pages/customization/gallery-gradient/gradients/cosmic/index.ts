export const cosmicGradient = {
  id: 'cosmic',
  name: 'Cosmic Dust',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 40% 80% at 90% 10%, hsl(260 100% 70%) 0%, transparent 50%),
      radial-gradient(ellipse 90% 40% at 10% 90%, hsl(320 100% 65%) 0%, transparent 50%),
      radial-gradient(ellipse 60% 70% at 70% 60%, hsl(280 100% 60%) 0%, transparent 50%),
      conic-gradient(from 45deg at 30% 70%, hsl(260 100% 60%) 0deg, hsl(280 100% 55%) 90deg, hsl(320 100% 60%) 180deg, hsl(260 100% 60%) 270deg),
      linear-gradient(135deg, hsl(250 100% 50%) 0%, hsl(280 100% 45%) 50%, hsl(320 100% 55%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 40% 80% at 90% 10%, #8b5cf6 0%, transparent 50%),
    radial-gradient(ellipse 90% 40% at 10% 90%, #ec4899 0%, transparent 50%),
    radial-gradient(ellipse 60% 70% at 70% 60%, #a855f7 0%, transparent 50%),
    conic-gradient(from 45deg at 30% 70%, #6366f1 0deg, #9333ea 90deg, #ec4899 180deg, #6366f1 270deg),
    linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #db2777 100%)
  `
};
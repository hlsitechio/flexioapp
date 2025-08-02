export const oceanGradient = {
  id: 'ocean',
  name: 'Ocean Depths',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 80% 50% at 20% 40%, hsl(210 100% 70%) 0%, transparent 50%),
      radial-gradient(ellipse 80% 70% at 90% 70%, hsl(190 100% 60%) 0%, transparent 50%),
      radial-gradient(ellipse 100% 60% at 50% 100%, hsl(220 90% 50%) 0%, transparent 50%),
      linear-gradient(135deg, hsl(210 100% 55%) 0%, hsl(190 100% 45%) 50%, hsl(220 90% 40%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 80% 50% at 20% 40%, #60a5fa 0%, transparent 50%),
    radial-gradient(ellipse 80% 70% at 90% 70%, #06b6d4 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 50% 100%, #4338ca 0%, transparent 50%),
    linear-gradient(135deg, #3b82f6 0%, #0891b2 50%, #3730a3 100%)
  `
};
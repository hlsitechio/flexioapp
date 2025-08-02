export const forestGradient = {
  id: 'forest',
  name: 'Forest Mist',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 70% 60% at 30% 20%, hsl(150 100% 65%) 0%, transparent 50%),
      radial-gradient(ellipse 90% 80% at 80% 80%, hsl(170 100% 55%) 0%, transparent 50%),
      radial-gradient(ellipse 60% 100% at 60% 0%, hsl(160 100% 60%) 0%, transparent 50%),
      linear-gradient(225deg, hsl(150 100% 50%) 0%, hsl(160 100% 45%) 50%, hsl(170 100% 40%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 70% 60% at 30% 20%, #34d399 0%, transparent 50%),
    radial-gradient(ellipse 90% 80% at 80% 80%, #0d9488 0%, transparent 50%),
    radial-gradient(ellipse 60% 100% at 60% 0%, #22c55e 0%, transparent 50%),
    linear-gradient(225deg, #22c55e 0%, #059669 50%, #0f766e 100%)
  `
};
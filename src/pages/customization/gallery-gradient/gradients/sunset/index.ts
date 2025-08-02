export const sunsetGradient = {
  id: 'sunset',
  name: 'Sunset Glow',
  class: 'relative overflow-hidden',
  style: {
    background: `
      radial-gradient(ellipse 100% 50% at 50% 100%, hsl(25 100% 65%) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 90% 30%, hsl(350 100% 60%) 0%, transparent 50%),
      radial-gradient(ellipse 80% 60% at 10% 70%, hsl(320 100% 65%) 0%, transparent 50%),
      linear-gradient(90deg, hsl(25 100% 60%) 0%, hsl(350 100% 55%) 50%, hsl(320 100% 60%) 100%)
    `
  },
  preview: `
    radial-gradient(ellipse 100% 50% at 50% 100%, #fb923c 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 90% 30%, #f43f5e 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 10% 70%, #ec4899 0%, transparent 50%),
    linear-gradient(90deg, #ea580c 0%, #e11d48 50%, #db2777 100%)
  `
};
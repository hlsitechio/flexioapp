// Font loading utility for optimal performance
export const loadInterFont = () => {
  // Create and inject the font stylesheet dynamically
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  
  // Add to head when document is ready
  if (document.head) {
    document.head.appendChild(link);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(link);
    });
  }
};

// Alternative: Font face declarations (for even better control)
export const injectFontCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  `;
  document.head.appendChild(style);
};
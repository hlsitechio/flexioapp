import { useEffect } from 'react';

// Critical CSS for above-the-fold content
const criticalCSS = `
  /* Critical styles for landing page */
  .hero-section {
    background: linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)));
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-title {
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  
  .hero-description {
    font-size: clamp(1.25rem, 4vw, 2rem);
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.8;
  }
  
  .hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    color: hsl(var(--primary-foreground));
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px hsl(var(--primary) / 0.4);
  }
  
  .btn-outline {
    border: 2px solid hsl(var(--border));
    background: transparent;
    color: hsl(var(--foreground));
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-outline:hover {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
  }
  
  /* Navigation critical styles */
  .nav-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: hsl(var(--background) / 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .nav-container {
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
  }
  
  .logo {
    height: 4rem;
    width: auto;
  }
  
  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export function CriticalCSS() {
  useEffect(() => {
    // Only inject if not already present
    if (!document.getElementById('critical-css')) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }
  }, []);

  return null;
}
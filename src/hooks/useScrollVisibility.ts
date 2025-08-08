import { useEffect, useRef, useState } from 'react';

// Detect scroll direction and top position, and expose a normalized progress (0-1)
export function useScrollVisibility(threshold = 8, maxForFullEffect = 240) {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [progress, setProgress] = useState(0); // 0 at top, 1 after maxForFullEffect px
  const lastY = useRef<number>(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrollingDown(y > lastY.current + threshold);
          setAtTop(y <= threshold);
          const p = Math.min(1, Math.max(0, y / maxForFullEffect));
          setProgress(p);
          lastY.current = y;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, maxForFullEffect]);

  return { scrollingDown, atTop, progress };
}

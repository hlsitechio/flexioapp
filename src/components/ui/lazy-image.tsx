import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from './loading-skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  skeletonClassName?: string;
  eager?: boolean; // For above-the-fold images
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.svg',
  skeletonClassName,
  eager = false,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (eager) return; // Skip intersection observer for eager images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [eager]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !hasError && (
        <LoadingSkeleton 
          variant="card" 
          className={cn("absolute inset-0", skeletonClassName)}
          animated={true}
        />
      )}
      
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}

// WebP support utility
export function createWebPSource(src: string): string {
  if (src.includes('.')) {
    const parts = src.split('.');
    const ext = parts.pop();
    const name = parts.join('.');
    return `${name}.webp`;
  }
  return src;
}

// Progressive image component with WebP support
export function ProgressiveImage(props: LazyImageProps) {
  const webpSrc = createWebPSource(props.src);
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <LazyImage {...props} />
    </picture>
  );
}
import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string;
  duration?: number;
  easing?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
  distance = '50px',
  duration = 800,
  easing = 'cubic-bezier(0.5, 0, 0, 1)',
  once = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial styles
    let translateValue = '0';
    switch (direction) {
      case 'up':
        translateValue = `translate3d(0, ${distance}, 0)`;
        break;
      case 'down':
        translateValue = `translate3d(0, -${distance}, 0)`;
        break;
      case 'left':
        translateValue = `translate3d(${distance}, 0, 0)`;
        break;
      case 'right':
        translateValue = `translate3d(-${distance}, 0, 0)`;
        break;
      case 'none':
        translateValue = 'translate3d(0, 0, 0)';
        break;
    }

    element.style.opacity = '0';
    element.style.transform = translateValue;
    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    element.style.willChange = 'opacity, transform';

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate3d(0, 0, 0)';
            hasAnimated.current = true;
          }, delay);

          if (once && observerRef.current) {
            observerRef.current.unobserve(element);
          }
        } else if (!entry.isIntersecting && !once && hasAnimated.current) {
          element.style.opacity = '0';
          element.style.transform = translateValue;
          hasAnimated.current = false;
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '0px'
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, delay, direction, distance, duration, easing, once]);

  return (
    <div ref={elementRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default ScrollReveal;

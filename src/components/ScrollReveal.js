'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '', animation = 'fade-up', delay = 0, duration = 800 }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if IntersectionObserver is supported (client-side)
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px', // Trigger slightly before element is fully in view
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  const styles = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      ref={elementRef}
      className={`reveal-element ${animation} ${isVisible ? 'revealed' : ''} ${className}`}
      style={styles}
    >
      {children}
    </div>
  );
}

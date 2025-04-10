
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Reset animation
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';

    // Trigger animation
    const timer = setTimeout(() => {
      element.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div ref={elementRef} className="w-full min-h-[60vh]">
      {children}
    </div>
  );
};

export default PageTransition;

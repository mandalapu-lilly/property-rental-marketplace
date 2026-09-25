import React, { useRef, useState, useCallback } from 'react';

/**
 * High-performance 3D perspective tilt component with dynamic specular glare
 * Uses GPU accelerated CSS 3D transforms with zero layout thrashing.
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 7, // subtle maximum tilt degrees
  perspective = 1000,
  scale = 1.02,
  glare = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = useCallback(
    (e) => {
      if (isTouch || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 0.1s ease-out, box-shadow 0.2s ease',
      });

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlareStyle({
          opacity: 0.35,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212, 185, 150, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
          transition: 'opacity 0.2s ease',
        });
      }
    },
    [isTouch, maxTilt, perspective, scale, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.4s ease',
    });
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      className={`relative transform-gpu ${className}`}
      {...props}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

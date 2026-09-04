import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const SignatureCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);
  const [cursorText, setCursorText] = useState('VIEW');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over element that triggers cursor
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest('[data-cursor]');
      if (trigger) {
        setIsActive(true);
        const text = trigger.getAttribute('data-cursor') || 'VIEW';
        setCursorText(text);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={`custom-cursor ${isActive ? 'active' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${isActive ? 1 : 0})`,
      }}
    >
      <span>{cursorText}</span>
      <ArrowRight className="cursor-arrow" size={16} />
    </div>
  );
};

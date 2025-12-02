'use client';
import { useEffect } from 'react';

export default function PreloadedResources() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/icons/sprite.svg';
    link.as = 'fetch'; // используем fetch для <use>
    link.type = 'image/svg+xml';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}

import { useEffect, useRef, useState } from 'react';

interface ScrollState {
  scrollY: number;
}

export function useScrollRestore(key: string) {
  const storageKey = `scroll:${key}`;
  const scrollRef = useRef(0);
  const [shouldRestore, setShouldRestore] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        const state = JSON.parse(saved) as ScrollState;
        scrollRef.current = state.scrollY || 0;
        setShouldRestore(scrollRef.current > 0);
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, JSON.stringify({ scrollY: window.scrollY }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [storageKey]);

  useEffect(() => {
    if (!shouldRestore) return;
    const y = scrollRef.current;
    const raf = requestAnimationFrame(() => {
      scrollTo(0, y);
      setTimeout(() => {
        scrollTo(0, y);
        setShouldRestore(false);
      }, 150);
    });
    return () => cancelAnimationFrame(raf);
  }, [shouldRestore]);

  return { shouldRestore, setShouldRestore };
}

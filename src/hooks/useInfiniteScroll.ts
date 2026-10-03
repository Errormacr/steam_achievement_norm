import { useCallback, useEffect, useRef } from 'react';

export function useInfiniteScroll (callback: () => void, hasMore: boolean, isLoading: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  const disconnect = useCallback(() => {
    observer.current?.disconnect();
    observer.current = null;
  }, []);

  // Always tear the observer down, including while loading, otherwise a stale
  // observer keeps firing and triggers duplicate page loads.
  useEffect(() => disconnect, [disconnect]);

  return useCallback(
    (node: Element) => {
      disconnect();

      if (!node || isLoading || !hasMore) return;

      const currentObserver = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      });

      observer.current = currentObserver;
      currentObserver.observe(node);
    },
    [callback, disconnect, hasMore, isLoading]
  );
}

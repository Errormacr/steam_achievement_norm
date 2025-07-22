import { useCallback, useRef } from 'react';

export function useInfiniteScroll (callback: () => void, hasMore: boolean, isLoading: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: Element) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );
}

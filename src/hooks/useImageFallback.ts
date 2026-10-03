import { useCallback, useEffect, useState } from 'react';
import { logger } from '../utils/logger';

/**
 * URLs that already failed to load. Steam's CDN returns 404 for some
 * achievement icons, and the same broken URLs come back on every re-render
 * and on each infinite-scroll page, so remember the failures instead of
 * re-requesting them.
 */
const brokenUrls = new Set<string>();

export function useImageFallback(src: string | null | undefined) {
  const isKnownBroken = Boolean(src && brokenUrls.has(src));
  const [isBroken, setIsBroken] = useState(isKnownBroken);

  // Reset when the src changes: without this a single broken icon would stick
  // the fallback on for every other achievement rendered afterwards.
  useEffect(() => {
    setIsBroken(Boolean(src && brokenUrls.has(src)));
  }, [src]);

  const handleError = useCallback(() => {
    if (src) {
      brokenUrls.add(src);
    }
    logger.warn(`Image failed to load, using fallback: ${src}`);
    setIsBroken(true);
  }, [src]);

  return {
    isBroken,
    handleError,
    canRender: Boolean(src) && !isBroken,
  };
}
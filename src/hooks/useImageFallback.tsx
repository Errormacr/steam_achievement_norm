import React, { useCallback, useEffect, useState } from 'react';
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

interface AvatarFallbackProps {
  className?: string;
  /** Square size in pixels; defaults to the caller's CSS-driven box. */
  size?: number;
}

/**
 * Neutral stand-in for a Steam avatar. Users with a private profile have no
 * avatar image, so the URL is valid but resolves to nothing.
 */
export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-fallback-icon="true"
    aria-label="no avatar"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <rect x="2" y="2" width="60" height="60" rx="30" ry="30" fill="#3a4048" />
    <circle cx="32" cy="25" r="11" fill="#79838f" />
    <path
      d="M12 58c0-11.046 8.954-20 20-20s20 8.954 20 20z"
      fill="#79838f"
    />
  </svg>
);
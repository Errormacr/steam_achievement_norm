import React from 'react';
import { useImageFallback } from '../hooks/useImageFallback';

interface GameCapsuleImageProps {
  appid: string;
  alt: string;
  className?: string;
  /** Rendered width; keeps the capsule square like the real image. */
  size?: number;
}

const CAPSULE_URL = (appid: string) =>
  `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`;

/**
 * Neutral tile shown when Steam has no capsule for an appid (unreleased games,
 * delisted titles, wrong id). Colours come from the theme variables so it
 * follows light/dark mode instead of hardcoding one palette.
 */
export const GameCapsuleFallback: React.FC<{ alt: string; className?: string; size?: number }> = ({
  alt,
  className,
  size = 120,
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    data-fallback-icon="true"
    role="img"
    aria-label={alt}
    style={{ display: 'block', borderRadius: 4 }}
  >
    <rect width="64" height="64" rx="4" fill="var(--bg-secondary, #2d2d2d)" />
    <rect
      x="0.5"
      y="0.5"
      width="63"
      height="63"
      rx="3.5"
      fill="none"
      stroke="var(--border-color, #404040)"
    />
    {/* Stylised console body, so the tile still reads as "a game". */}
    <path
      d="M18 22h28a10 10 0 0 1 9.8 7.9l2.4 8.6A6 6 0 0 1 47.4 44l-3.4-5.6a4 4 0 0 0-3.3-1.8H23.3A4 4 0 0 0 20 38.4L16.6 44A6 6 0 0 1 5.8 38.5l2.4-8.6A10 10 0 0 1 18 22z"
      fill="none"
      stroke="var(--text-secondary, #b3b3b3)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 29v8M16 33h8"
      stroke="var(--text-secondary, #b3b3b3)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="45" cy="31" r="2" fill="var(--text-secondary, #b3b3b3)" />
    <circle cx="49" cy="36" r="2" fill="var(--text-secondary, #b3b3b3)" />
  </svg>
);

/**
 * Game capsule that degrades to a neutral tile instead of a broken image.
 * The previous inline onError re-assigned the very same src on every failure,
 * which just re-requested the missing image forever.
 */
export const GameCapsuleImage: React.FC<GameCapsuleImageProps> = ({
  appid,
  alt,
  className,
  size = 120,
}) => {
  const src = CAPSULE_URL(appid);
  const { handleError, canRender } = useImageFallback(src);

  if (!canRender) {
    return <GameCapsuleFallback alt={alt} className={className} size={size} />;
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={handleError}
    />
  );
};

export default GameCapsuleImage;
import React from 'react';
import { useImageFallback } from '../hooks/useImageFallback';

interface GameCapsuleImageProps {
  appid: string;
  alt: string;
  className?: string;
}

const CAPSULE_URL = (appid: string) =>
  `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`;

/**
 * Game capsule that degrades to a neutral tile instead of a broken image.
 * The previous inline onError re-assigned the very same src on every failure,
 * which just re-requested the missing image forever.
 */
export const GameCapsuleImage: React.FC<GameCapsuleImageProps> = ({
  appid,
  alt,
  className,
}) => {
  const src = CAPSULE_URL(appid);
  const { handleError, canRender } = useImageFallback(src);

  if (!canRender) {
    return (
      <div
        className={className}
        data-fallback-icon="true"
        aria-label={alt}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#3a4048',
          borderRadius: 4,
        }}
      />
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={handleError}
    />
  );
};

export default GameCapsuleImage;
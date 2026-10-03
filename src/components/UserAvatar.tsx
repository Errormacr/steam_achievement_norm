import React from 'react';
import { AvatarFallback, useImageFallback } from '../hooks/useImageFallback';

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
}

/**
 * Avatar with a graceful fallback: Steam accounts with a private profile
 * expose a valid avatar URL that resolves to nothing.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, className }) => {
  const { handleError, canRender } = useImageFallback(src);

  if (!canRender) {
    return <AvatarFallback className={className} />;
  }

  return (
    <img
      className={className}
      src={src as string}
      alt={alt}
      onError={handleError}
    />
  );
};

export default UserAvatar;
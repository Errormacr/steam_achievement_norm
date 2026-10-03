import React from 'react';
import AchievementFallbackIcon from './AchievementFallbackIcon';
import { useImageFallback } from '../hooks/useImageFallback';

interface AchievementImageProps {
  icon: string | null;
  displayName: string;
  description: string;
  percent: number;
  unlockedDate: Date | null;
  gameName?: string;
  gray?: boolean;
}
const getAchievementClass = (percent: number): string => {
  if (percent <= 5) return 'rare1';
  if (percent <= 20) return 'rare2';
  if (percent <= 45) return 'rare3';
  if (percent <= 60) return 'rare4';
  return 'rare5';
};

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleString();
};

const AchievementImage: React.FC<AchievementImageProps> = ({
  icon,
  displayName,
  description,
  percent,
  unlockedDate,
  gameName,
  gray = false,
}) => {
  const title = [
    gameName,
    displayName,
    description,
    `${percent.toFixed(2)}%`,
    formatDate(unlockedDate)
  ]
    .filter(Boolean)
    .join('\n');

  // Falls back not only when the URL is missing, but also when Steam's CDN
  // answers 404 for it.
  const { handleError, canRender } = useImageFallback(icon);

  return (
    <div className="Cont">
      {canRender ? (
        <img
          className={getAchievementClass(percent)}
          src={icon as string}
          alt={displayName}
          title={title}
          onError={handleError}
        />
      ) : (
        <AchievementFallbackIcon
          className={getAchievementClass(percent)}
          gray={gray}
          title={title}
        />
      )}
    </div>
  );
};

export default AchievementImage;

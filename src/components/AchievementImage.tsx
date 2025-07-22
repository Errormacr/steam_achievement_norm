import React from 'react';

interface AchievementImageProps {
  icon: string;
  displayName: string;
  description: string;
  percent: number;
  unlockedDate: Date | null;
  gameName?: string;
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
  gameName
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

  return (
    <div className="Cont">
        <img
          className={getAchievementClass(percent)}
          src={icon}
          alt={displayName}
          title={title}
        />
    </div>
  );
};

export default AchievementImage;

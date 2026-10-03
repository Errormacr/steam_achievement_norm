import React from 'react';
import { AchievmentsFromView } from '../types';
import AchievementFallbackIcon from './AchievementFallbackIcon';
import { useImageFallback } from '../hooks/useImageFallback';

interface AchievementRowProps {
    achievement: AchievmentsFromView;
    isLast: boolean;
    lastElementRef: (node: HTMLTableRowElement) => void;
}

const getImgClass = (percent: number): string => {
  if (percent <= 5) return 'rare1 table-ach-img';
  if (percent <= 20) return 'rare2 table-ach-img';
  if (percent <= 45) return 'rare3 table-ach-img';
  if (percent <= 60) return 'rare4 table-ach-img';
  return 'rare5 table-ach-img';
};

export const AchievementRow: React.FC<AchievementRowProps> = ({ achievement, isLast, lastElementRef }) => {
  const rowClass = achievement.percent <= 5 ? 'rare1' : '';
  const imgClass = getImgClass(achievement.percent);
  const formattedDate = achievement.unlockedDate
    ? new Date(achievement.unlockedDate).toLocaleString()
    : '';

  const icon = achievement.unlocked ? achievement.icon : achievement.grayIcon;
  // Falls back not only when the URL is missing, but also when Steam's CDN
  // answers 404 for it.
  const { handleError, canRender } = useImageFallback(icon);

  // Mirrors the tooltip built in AchievementImage so both views expose the
  // same details on hover, for real and for placeholder icons alike.
  const title = [
    achievement.displayName,
    achievement.description,
    `${achievement.percent.toFixed(2)}%`,
    formattedDate,
  ]
    .filter(Boolean)
    .join('\n');

  return (
        <tr
            className={rowClass}
            ref={isLast ? lastElementRef : undefined}
        >
            <td>
              {canRender ? (
                <img
                  className={imgClass}
                  src={icon as string}
                  alt={achievement.displayName}
                  title={title}
                  onError={handleError}
                />
              ) : (
                <AchievementFallbackIcon
                  className={imgClass}
                  gray={!achievement.unlocked}
                  size={40}
                  title={title}
                />
              )}
            </td>
            <td>{achievement.displayName}</td>
            <td>{achievement.description}</td>
            <td>{achievement.percent.toFixed(2)}%</td>
            <td>{formattedDate}</td>
        </tr>
  );
};

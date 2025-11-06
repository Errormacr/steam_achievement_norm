import React from 'react';
import { AchievmentsFromView } from '../interfaces';

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

  return (
        <tr
            className={rowClass}
            ref={isLast ? lastElementRef : undefined}
            key={achievement.displayName}
        >
            <td>
                <img
                    className={imgClass}
                    src={achievement.unlocked ? achievement.icon : achievement.grayIcon}
                    alt={achievement.displayName}
                />
            </td>
            <td>{achievement.displayName}</td>
            <td>{achievement.description}</td>
            <td>{achievement.percent.toFixed(2)}%</td>
            <td>{formattedDate}</td>
        </tr>
  );
};

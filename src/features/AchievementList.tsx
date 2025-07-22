import React from 'react';
import { useTranslation } from 'react-i18next';
import { AchievmentsFromView } from '../interfaces';
import AchievementImage from '../components/AchievementImage';

interface AchievementListProps {
  achievements: AchievmentsFromView[];
  newAchievements: number[];
  isLoading: boolean;
  lastAchievementRef: (node: HTMLDivElement) => void;
}

export const AchievementList: React.FC<AchievementListProps> = ({ achievements, newAchievements, isLoading, lastAchievementRef }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="AchCont">
        {achievements.map((achievement, index, arr) => (
          <div
            key={`${achievement.displayName}`}
            ref={index === arr.length - 1 ? lastAchievementRef : undefined}
            className={`achievement-item ${newAchievements.includes(index) ? 'new-achievement' : ''}`}
          >
            <AchievementImage
              icon={achievement.unlocked ? achievement.icon : achievement.grayIcon}
              displayName={achievement.displayName}
              description={achievement.description}
              percent={achievement.percent}
              unlockedDate={achievement.unlockedDate ? new Date(achievement.unlockedDate) : null}
              gameName={achievement.game?.gamename}
            />
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>{t('Loading...')}</span>
        </div>
      )}
    </>
  );
};

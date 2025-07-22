import React from 'react';
import { useTranslation } from 'react-i18next';
import '../scss/UpdateGameProgress.scss';

interface UpdateProgressProps {
  progress: {
    gameCount: number | null;
    finishedGameCount: number;
    updatedGames: string[];
    isError: boolean;
    isConnected: boolean;
    progressPercent: number;
  };
}

const UpdateProgress: React.FC<UpdateProgressProps> = ({ progress }) => {
  const { t } = useTranslation();
  const { gameCount, finishedGameCount, updatedGames, isError, isConnected, progressPercent } = progress;

  if (!isConnected && !isError) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="loading-message">{t('connecting')}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="error-message">{t('connectionError')}</div>
      </div>
    );
  }

  if (gameCount === null) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="loading-message">{t('loading')}</div>
      </div>
    );
  }

  if (gameCount === 0) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="no-games-message">{t('noGames')}</div>
      </div>
    );
  }

  return (
    <div className="update-progress">
      <h3>{t('updateProgressTitle')}</h3>
      <div className="progress-container">
        <div className="progress-header">
          <p>
            {t('finishedUpdate')} {finishedGameCount} {t('ofUpdated')} {gameCount} {progressPercent}%
          </p>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <ul>
          {updatedGames.length > 0 &&
            updatedGames.map((game, index) => (
              <li key={index} className="list-item">{game}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UpdateProgress;
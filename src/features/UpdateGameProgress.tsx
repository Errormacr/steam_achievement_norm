import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/scss/UpdateGameProgress.scss';
import CircularProgressSVG from '../components/CircularProgressSVG';

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

const StatusMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="status-message">{message}</div>
);

const UpdateProgress: React.FC<UpdateProgressProps> = ({ progress }) => {
  const { t } = useTranslation();
  const { gameCount, finishedGameCount, updatedGames, isError, isConnected, progressPercent } = progress;

  const renderContent = () => {
    if (!isConnected && !isError) {
      return <StatusMessage message={t('connecting')} />;
    }

    if (isError) {
      return <StatusMessage message={t('connectionError')} />;
    }

    if (gameCount === null) {
      return <StatusMessage message={t('loading')} />;
    }

    if (gameCount === 0) {
      return <StatusMessage message={t('noGames')} />;
    }

    return (
      <div className="progress-container">
        <div className="progress-circular">
            <CircularProgressSVG percent={progressPercent} size={150} strokeWidth={10} />
        </div>
        <div className="progress-header">
          <p>
            {t('finishedUpdate')} {finishedGameCount} {t('ofUpdated')} {gameCount}
          </p>
        </div>
        <ul className="updated-games-list">
          {updatedGames.length > 0 &&
            updatedGames.map((game, index) => (
              <li key={`${game}_updated_${index}`} className="list-item">{game}</li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="update-progress-container">
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        {renderContent()}
      </div>
    </div>
  );
};

export default UpdateProgress;

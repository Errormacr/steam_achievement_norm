import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from './SocketProvider';
import { toast } from 'react-toastify';
import './scss/UpdateGameProgress.scss';
import { UpdateGameEvent } from '../interfaces'; // Подключаем SCSS файл

export default function UpdateProgress (): React.JSX.Element {
  const [gameCount, setGameCount] = useState(0);
  const [finishedGameCount, setFinishedGameCount] = useState(0);
  const [updatedGames, setUpdatedGames] = useState<string[]>([]);
  const { t } = useTranslation();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleGameCount = (data: { count: number }) => {
      setGameCount(data.count);
      if (data.count === 0) {
        toast.warn(t('noGames'));
      }
    };

    const handleUpdateGame = ({ gamename }:UpdateGameEvent) => {
      setFinishedGameCount((prev) => prev + 1);
      setUpdatedGames((prev) => [gamename, ...prev.slice(0, 19)]);
    };
    const handleStatus = () => {
      setGameCount(0);
      setFinishedGameCount(0);
      setUpdatedGames([]);
    };
    socket.on('gameCount', handleGameCount);
    socket.on('updateGame', handleUpdateGame);
    socket.on('status', handleStatus);
    socket.connect();

    return () => {
      socket.off('gameCount', handleGameCount);
      socket.off('updateGame', handleUpdateGame);
      socket.off('status', handleStatus);
      socket.disconnect();
    };
  }, [socket, t]);
  const progressPercent = gameCount > 0
    ? Math.round((finishedGameCount / gameCount) * 100)
    : 0;

  return (
    gameCount > 0 && (

          <div className="update-progress">
            <h3>{t('updateProgressTitle')}</h3>

            <div className="progress-container">
              <div className="progress-header">
                <p>
                  {t('finishedUpdate')} {finishedGameCount} {t('ofUpdated')} {gameCount} {progressPercent}%
                </p>
              </div>
              {gameCount > 0 && (
                  <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
              )}
              <ul>
                {updatedGames.length > 0 &&
                  (
                    updatedGames.map((game, index) => (
                        <li
                            key={index}
                            className="list-item">{game}</li>
                    ))
                  )}
              </ul>
            </div>
          </div>
    )
  );
}

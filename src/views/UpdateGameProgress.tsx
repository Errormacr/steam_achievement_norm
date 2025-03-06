import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from './SocketProvider';
import { toast } from 'react-toastify';
import ProgressRad from './rad_progress';
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

    const handleUpdateGame = ({ appid, gamename }:UpdateGameEvent) => {
      console.log(appid, gamename);
      setFinishedGameCount((prev) => prev + 1);
      setUpdatedGames((prev) => [gamename, ...prev]);
    };
    const handleStatus = (data: string) => {
      setGameCount(0);
      setFinishedGameCount(0);
      setUpdatedGames([]);
      console.log('Status:', data);
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

  return (
    gameCount > 0 && (
          <div className="update-progress">
            <h3>{t('updateProgressTitle')}</h3>

            <div className="progress-container">
              <p>
                {t('gamesUpdated')}: {finishedGameCount}/{gameCount}
              </p>
              <ul>
                {updatedGames.length > 0
                  ? (
                      updatedGames.map((game, index) => (
                        <li key={index}>{game}</li>
                      ))
                    )
                  : (
                    <p className="no-games-updated">{t('noGamesUpdated')}</p>
                    )}
              </ul>
            </div>
          </div>
    )
  );
}

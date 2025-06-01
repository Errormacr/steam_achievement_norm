import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from './SocketProvider';
import { toast } from 'react-toastify';
import '../scss/UpdateGameProgress.scss';
import { UpdateGameEvent } from '../../interfaces'; // Подключаем SCSS файл

export default function UpdateProgress (): React.JSX.Element {
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [finishedGameCount, setFinishedGameCount] = useState(0);
  const [updatedGames, setUpdatedGames] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const { t } = useTranslation();
  const socket = useSocket();

  useEffect(() => {
    let reconnectTimer: any;
    let isComponentMounted = true;

    const connectSocket = () => {
      if (!socket) {
        setIsError(true);
        setIsConnecting(false);
        toast.error(t('connectionError'));
        return;
      }

      setIsConnecting(true);
      socket.connect();
    };

    const handleConnect = () => {
      if (isComponentMounted) {
        setIsConnecting(false);
        setIsError(false);
        // Запрашиваем начальные данные после успешного подключения
        socket.emit('requestStatus');
      }
    };

    const handleGameCount = (data: { count: number }) => {
      if (!isComponentMounted) return;

      setGameCount(data.count);
      setIsError(false);
      setIsConnecting(false);
      if (data.count === 0) {
        toast.warn(t('noGames'));
      }
    };

    const handleUpdateGame = ({ gamename }: UpdateGameEvent) => {
      if (!isComponentMounted) return;

      setFinishedGameCount((prev) => prev + 1);
      setUpdatedGames((prev) => [gamename, ...prev.slice(0, 19)]);
    };

    const handleStatus = () => {
      if (!isComponentMounted) return;

      setGameCount(null);
      setFinishedGameCount(0);
      setUpdatedGames([]);
      setIsError(false);
    };

    const handleError = () => {
      if (!isComponentMounted) return;

      setIsError(true);
      setIsConnecting(false);
      toast.error(t('connectionError'));

      // Попытка переподключения через 5 секунд
      reconnectTimer = setTimeout(() => {
        if (isComponentMounted) {
          connectSocket();
        }
      }, 5000);
    };

    const handleDisconnect = () => {
      if (!isComponentMounted) return;

      setIsConnecting(true);
      // Попытка немедленного переподключения
      connectSocket();
    };

    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('gameCount', handleGameCount);
      socket.on('updateGame', handleUpdateGame);
      socket.on('status', handleStatus);
      socket.on('connect_error', handleError);
      socket.on('error', handleError);

      connectSocket();
    }

    return () => {
      isComponentMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('gameCount', handleGameCount);
        socket.off('updateGame', handleUpdateGame);
        socket.off('status', handleStatus);
        socket.off('connect_error', handleError);
        socket.off('error', handleError);
        socket.disconnect();
      }
    };
  }, [socket, t]);

  const progressPercent = gameCount && gameCount > 0
    ? Math.round((finishedGameCount / gameCount) * 100)
    : 0;

  if (isConnecting) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="loading-message">
          {t('connecting')}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="error-message">
          {t('connectionError')}
        </div>
      </div>
    );
  }

  if (gameCount === null) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="loading-message">
          {t('loading')}
        </div>
      </div>
    );
  }

  if (gameCount === 0) {
    return (
      <div className="update-progress">
        <h3>{t('updateProgressTitle')}</h3>
        <div className="no-games-message">
          {t('noGames')}
        </div>
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
          {updatedGames.length > 0 && (
            updatedGames.map((game, index) => (
              <li key={index} className="list-item">{game}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

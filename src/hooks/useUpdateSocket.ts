import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { Percent, ProfileUpdateResponse, UpdateGameEvent } from '../types';
import { useSocket } from '../features/SocketProvider';
import { ApiService } from '../services/api.services';

export function useUpdateSocket (rerender: () => void) {
  const socket = useSocket();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [finishedGameCount, setFinishedGameCount] = useState(0);
  const [updatedGames, setUpdatedGames] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);

  const startUpdate = useCallback(async (type: string) => {
    if (socket) {
      setIsUpdating(true);
      const steamId = localStorage.getItem('steamId');
      const language = i18n.language;
      const data = { steamId, language };

      try {
        const profileUpdate = await ApiService.put<ProfileUpdateResponse>(`user/${steamId}/profile`);
        if (profileUpdate.updated) {
          if (profileUpdate.changes.nickname) {
            toast.info(t('nicknameUpdated'));
          }
          if (profileUpdate.changes.avatar) {
            toast.info(t('avatarUpdated'));
          }
          rerender();
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }

      if (type === 'ach-percentage') {
        socket.emit(type, { steamId });
      } else {
        socket.emit(type, data);
      }
    }
  }, [socket, rerender, t]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleStatus = () => {
      setIsUpdating(false);
      setGameCount(null);
      setFinishedGameCount(0);
      setUpdatedGames([]);
      setIsError(false);
      rerender();
    };
    const handleChange = (data: Percent) => {
      toast.success(`+ ${data.change.toFixed(2)}% ${t('averageUp')}`);
    };
    const handleGameCount = (data: { count: number }) => {
      setGameCount(data.count);
      if (data.count === 0) {
        toast.warn(t('noGames'));
      }
    };
    const handleUpdateGame = ({ gamename }: UpdateGameEvent) => {
      setFinishedGameCount((prev) => prev + 1);
      setUpdatedGames((prev) => [gamename, ...prev.slice(0, 19)]);
    };
    const handleError = () => {
      setIsError(true);
      toast.error(t('connectionError'));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('status', handleStatus);
    socket.on('change', handleChange);
    socket.on('gameCount', handleGameCount);
    socket.on('updateGame', handleUpdateGame);
    socket.on('connect_error', handleError);
    socket.on('error', handleError);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('status', handleStatus);
      socket.off('change', handleChange);
      socket.off('gameCount', handleGameCount);
      socket.off('updateGame', handleUpdateGame);
      socket.off('connect_error', handleError);
      socket.off('error', handleError);
      socket.disconnect();
    };
  }, [socket, rerender, t]);

  useEffect(() => {
    const updated = sessionStorage.getItem('updated');
    if (!updated && isConnected) {
      sessionStorage.setItem('updated', 'true');
      startUpdate('recent');
    }
  }, [isConnected, startUpdate]);

  const progressPercent = gameCount && gameCount > 0
    ? Math.round((finishedGameCount / gameCount) * 100)
    : 0;

  return {
    isUpdating,
    startUpdate,
    progress: {
      gameCount,
      finishedGameCount,
      updatedGames,
      isError,
      isConnected,
      progressPercent
    }
  };
}

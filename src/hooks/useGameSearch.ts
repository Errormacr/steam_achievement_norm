import { useState } from 'react';
import { useDebouncyEffect } from 'use-debouncy';
import { ApiService } from '../services/api.services';
import { Game } from '../interfaces';
import { toast } from 'react-toastify';

export const useGameSearch = (appid: string) => {
  const [gamename, setGamename] = useState('');
  const [loading, setLoading] = useState(false);

  useDebouncyEffect(() => {
    const fetchGame = async () => {
      if (!appid) {
        setGamename('');
        return;
      }
      setLoading(true);
      try {
        const game = await ApiService.get<Game>(`steam-api/game-by-appid/${appid}`);
        setGamename(game?.gamename || '');
      } catch (error) {
        setGamename('');
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, 1000, [appid]);

  return { gamename, loading };
};

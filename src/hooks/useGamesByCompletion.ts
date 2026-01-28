import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';

interface GamesByCompletion {
  range: string;
  count: number;
}

export const useGamesByCompletion = () => {
  const [data, setData] = useState<GamesByCompletion[]>([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    ApiService.get<GamesByCompletion[]>(
      `user/${steamId}/games-by-completion`
    ).then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

  return data;
};

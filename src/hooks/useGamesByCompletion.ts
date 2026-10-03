import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';

interface GamesByCompletion {
  range: string;
  count: number;
}

export const useGamesByCompletion = () => {
  const [data, setData] = useState<GamesByCompletion[]>([]);

  useEffect(() => {
    let isMounted = true;
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    ApiService.get<GamesByCompletion[]>(
      `user/${steamId}/games-by-completion`
    ).then((fetchedData) => {
      // Guard against a late response overwriting another account's data.
      if (isMounted) {
        setData(fetchedData);
      }
    }).catch((error) => {
      logger.error('Failed to fetch games by completion', error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};

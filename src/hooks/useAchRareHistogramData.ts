import { useState, useEffect } from 'react';
import { ApiService } from '../services/api.services';
import { RareAchievementCount } from '../types';
import { HistogramValue } from '../types/sharedProps';

export function useAchRareHistogramData(gameAppid?: number) {
  const [data, setData] = useState<HistogramValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let query = 'percents=1';
    for (let i = 2; i <= 100; i += 1) {
      query += `,${i}`;
    }

    if (gameAppid) {
      query += `appid=${gameAppid}`;
    }

    ApiService.get<RareAchievementCount>(`user/achievements-rare-count/${steamId}?${query}`)
      .then((response) => {
        setData(Object.entries(response).map(([key, item]) => ({ count: item, name: `${key}%` })));
      })
      .catch((err) => {
        console.error("Failed to fetch rare achievement count:", err);
        setError(err);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gameAppid]);

  return { data, isLoading, error };
}

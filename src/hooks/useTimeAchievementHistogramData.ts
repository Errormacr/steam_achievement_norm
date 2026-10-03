import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { HistogramValue } from '../types/sharedProps';
import { TimeAchievementCount } from '../types';
import { logger } from '../utils/logger';

export const useTimeAchievementHistogramData = (gameAppid?: number) => {
  const [data, setData] = useState<HistogramValue[]>([]);

  useEffect(() => {
    let isMounted = true;
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    const gameUrl = gameAppid ? `?appid=${gameAppid}` : '';
    ApiService.get<TimeAchievementCount[]>(`user/${steamId}/achievements-count-by-time${gameUrl}`)
      .then((data) => {
        if (isMounted) {
          setData(data.map((item) => ({ count: item.count, name: item.date })));
        }
      })
      .catch(error => {
        logger.error('Failed to fetch time achievement data', error);
        if (isMounted) setData([]); // Reset data on error
      });

    return () => {
      isMounted = false;
    };
  }, [gameAppid]);

  return data;
};

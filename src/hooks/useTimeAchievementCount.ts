import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';
import { HistogramValue } from '../types/sharedProps';
import { TimeAchievementCount } from '../types';

export const useTimeAchievementCount = (gameAppid?: number) => {
  const [data, setData] = useState<HistogramValue[]>([]);

  useEffect(() => {
    let isMounted = true;
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    ApiService.get<TimeAchievementCount[]>(
      `user/${steamId}/achievements-count-by-time` + (gameAppid ? `?appid=${gameAppid}` : '')
    ).then((fetchedData) => {
      if (!isMounted) return;

      // Cumulative counts: each bucket adds the previous total.
      const transformedData = fetchedData.reduce<HistogramValue[]>((acc, item) => {
        const count = acc.length > 0 ? item.count + acc[acc.length - 1].count : item.count;
        acc.push({ count, name: item.date });
        return acc;
      }, []);
      setData(transformedData);
    }).catch((error) => {
      logger.error('Failed to fetch achievement count by time', error);
    });

    return () => {
      isMounted = false;
    };
  }, [gameAppid]);

  return data;
};

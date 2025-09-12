import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { HistogramValue } from '../interfaces/sharedProps';
import { TimeAchievementCount } from '../interfaces';

export const useTimeAchievementCount = (gameAppid?: number) => {
  const [data, setData] = useState<HistogramValue[]>([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    ApiService.get<TimeAchievementCount[]>(
      `user/${steamId}/achievements-count-by-time` + (gameAppid ? `?appid=${gameAppid}` : '')
    ).then((fetchedData) => {
      const transformedData = fetchedData.reduce((acc, item, i) => {
        const count = i > 0 ? item.count + acc[i - 1].count : item.count;
        return [
          ...acc,
          {
            count,
            name: item.date
          }
        ];
      }, [] as HistogramValue[]);
      setData(transformedData);
    });
  }, [gameAppid]);

  return data;
};

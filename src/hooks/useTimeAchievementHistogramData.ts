import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { HistogramValue } from '../interfaces/sharedProps';
import { TimeAchievementCount } from '../interfaces';

export const useTimeAchievementHistogramData = (gameAppid?: number) => {
  const [data, setData] = useState<HistogramValue[]>([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    const gameUrl = gameAppid ? `?appid=${gameAppid}` : '';
    ApiService.get<TimeAchievementCount[]>(`user/${steamId}/achievements-count-by-time${gameUrl}`)
      .then((data) => {
        setData(data.map((item) => ({ count: item.count, name: item.date })));
      })
      .catch(error => {
        console.error("Failed to fetch time achievement data:", error);
        setData([]); // Reset data on error
      });
  }, [gameAppid]);

  return data;
};

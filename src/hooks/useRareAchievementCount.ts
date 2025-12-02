import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { RareAchievementCount } from '../types';

export const useRareAchievementCount = (gameAppid?: number) => {
  const [counts, setCounts] = useState<RareAchievementCount>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const steamId = localStorage.getItem('steamId');
        if (!steamId) return;

        const params = new URLSearchParams({
          percents: '5,20,45,60'
        });
        if (gameAppid) {
          params.append('appid', gameAppid.toString());
        }

        const dataFromApi = await ApiService.get<RareAchievementCount>(
          `user/achievements-rare-count/${steamId}?${params.toString()}`
        );
        setCounts(dataFromApi);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [gameAppid]);

  return counts;
};

import { useEffect, useState } from 'react';
import { ApiService } from '../services/api.services';
import { AchievmentsFromView, Pagination } from '../types';
import i18n from 'i18next';
import { logger } from '../utils/logger';

interface AchPageParams {
    minPercent?: string;
    maxPercent?: string;
    date?: string;
    gameAppid?: string;
    unlocked?: -1 | 0 | 1;
}

export const useAchievementsPageData = ({ minPercent, maxPercent, date, gameAppid, unlocked }: AchPageParams) => {
  const [tableOrBox, setTableOrBox] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [achCount, setAchCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const boxView = localStorage.getItem('boxView') === 'true';
        if (isMounted) {
          setTableOrBox(boxView);
        }

        const steamId = localStorage.getItem('steamId');
        if (!steamId) {
          if (isMounted) setLoaded(true);
          return;
        }

        const queryParams = new URLSearchParams({
          orderBy: 'unlockedDate',
          desc: '1',
          language: i18n.language,
          page: '1',
          pageSize: '0'
        });

        if (unlocked === 0 || unlocked === 1) {
          queryParams.set('unlocked', String(unlocked));
        }

        if (minPercent) queryParams.set('percentMin', minPercent);
        if (maxPercent) queryParams.set('percentMax', maxPercent);

        if (date && date !== 'undefined') {
          queryParams.set('unlockedDate', date);
        }

        if (gameAppid && +gameAppid) {
          queryParams.set('appid', gameAppid);
        }

        const data = await ApiService.get<Pagination<AchievmentsFromView>>(
                    `user/${steamId}/achievements?${queryParams.toString()}`
        );

        if (isMounted) {
          setAchCount(data.count);
        }
      } catch (error) {
        logger.error('Failed to fetch achievements count', error);
      } finally {
        if (isMounted) {
          setLoaded(true);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [minPercent, maxPercent, date, gameAppid, unlocked, i18n.language]);

  return { tableOrBox, setTableOrBox, loaded, achCount };
};

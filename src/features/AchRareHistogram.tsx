import React, { useEffect, useState } from 'react';
import Histogram from '../components/Histogram';
import { HistogramValue } from '../types/sharedProps';
import { ApiService } from '../services/api.services';
import { RareAchievementCount } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AchRareHistogramProps {
  gameAppid?: number;
}

const AchRareHistogram: React.FC<AchRareHistogramProps> = ({ gameAppid }) => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);
    const { t } = useTranslation();
  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    let query = '';
    for (let i = 1; i <= 100; i += 1) {
      query += `percents=${i}&`;
    }

    if (gameAppid) {
      query += `appid=${gameAppid}`;
    }

    ApiService.get < RareAchievementCount >(`user/achievements-rare-count/${steamId}?${query}`).then((data) => {
      setData(Object.entries(data).map(([key, item]) => ({ count: item, name: `${key}%` })));
    });
  }, []);
  return (
            <Histogram
                onClick={(el : {
                activeLabel: string
            }) => {
                  const addUrl = gameAppid ? `/${gameAppid}` : '/undefined';
                  const [min,
                    max] = el
                    .activeLabel
                    .slice(0, -1)
                    .split('-');
                  navigate(`/achievements/${min}/${max}/undefined/Stats${addUrl}`);
                }}
                data={data}
                yLabel={t('count')}
                />
  );
};

export default AchRareHistogram;
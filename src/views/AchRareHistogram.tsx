import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { RareAchievementCount } from '../interfaces';

const AchRareHistogram : React.FC = () => {
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    let percents = '';
    for (let i = 1; i <= 100; i += 1) {
      percents += `percents=${i}&`;
    }
    ApiService.get < RareAchievementCount>(`user/achievements-rare-count/${steamId}?${percents}`).then((data) => {
      setData(Object.entries(data).map(([key, item]) => ({ count: item, name: `${key}%` })));
    });
  }, []);
  return (<> <Histogram
        data={data}/> </>
  );
};

export default AchRareHistogram;

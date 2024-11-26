import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { TimeAchievementCount } from '../interfaces';

const AchTimeHistogram : React.FC = () => {
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAchievementCount[]>(`user/achievements-count-by-time/${steamId}`).then((data) => {
      setData(data.map((item) => ({ count: item.count, name: item.date })));
    });
  }, []);
  return (<> <Histogram
        data={data}/> </>
  );
};

export default AchTimeHistogram;

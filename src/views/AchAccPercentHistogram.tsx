import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { TimeAveragePercent } from '../interfaces';

const AchAccPercentHistogram : React.FC = () => {
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAveragePercent>(`user/avg-percent-by-time/${steamId}`).then((data) => {
      setData(Object.entries(data).map(([key, item]) => ({ count: +item.toFixed(2), name: key })));
    });
  }, []);
  return (<> <Histogram
        data={data}/> </>
  );
};

export default AchAccPercentHistogram;

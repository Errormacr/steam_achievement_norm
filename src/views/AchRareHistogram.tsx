import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { RareAchievementCount } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const AchRareHistogram : React.FC = () => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    let percents = '';
    for (let i = 1; i <= 100; i += 1) {
      percents += `percents=${i}&`;
    }
    ApiService.get < RareAchievementCount >(`user/achievements-rare-count/${steamId}?${percents}`).then((data) => {
      setData(Object.entries(data).map(([key, item]) => ({ count: item, name: `${key}%` })));
    });
  }, []);
  return (
        <>
            <Histogram
                onClick={(el : {
                activeLabel: string
            }) => {
                  const [min,
                    max] = el
                    .activeLabel
                    .slice(0, el.activeLabel.length - 1)
                    .split('-');
                  navigate(`/achievements/${min}/${max}/undefined/stats`);
                }}
                data={data}/>
        </>
  );
};

export default AchRareHistogram;

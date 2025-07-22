import React, { useEffect, useState } from 'react';
import Histogram from '../components/Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { RareAchievementCount, statsComponentProps } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const AchRareHistogram : React.FC<statsComponentProps> = ({ gameAppid = undefined }) => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);
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
                    .slice(0, el.activeLabel.length - 1)
                    .split('-');
                  navigate(`/achievements/${min}/${max}/undefined/Stats${addUrl}`);
                }}
                data={data}/>
  );
};

export default AchRareHistogram;

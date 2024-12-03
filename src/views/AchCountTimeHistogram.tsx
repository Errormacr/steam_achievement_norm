import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { TimeAchievementCount } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const AchCountTimeHistogram : React.FC = () => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAchievementCount[] >(`user/achievements-count-by-time/${steamId}`).then((data) => {
      setData(data.reduce((acc, item, i) => {
        const count = i > 0
          ? item.count + acc[i - 1].count
          : item.count;
        return [
          ...acc, {
            count,
            name: item.date
          }
        ];
      }, []as HistogramValue[]));
    });
  }, []);
  return (
        <>
            <Histogram
                onClick={(el : {
                activeLabel: string
            }) => {
                  navigate(`/achievements/0/100/${el.activeLabel}/stats`);
                }}
                data={data}/>
        </>
  );
};

export default AchCountTimeHistogram;

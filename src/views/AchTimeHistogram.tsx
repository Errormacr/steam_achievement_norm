import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { statsComponentProps, TimeAchievementCount } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const AchTimeHistogram : React.FC <statsComponentProps> = ({ gameAppid }) => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAchievementCount[] >(`user/${steamId}/achievements-count-by-time` + `${gameAppid ? `?appid=${gameAppid}` : ''}`).then((data) => {
      setData(data.map((item) => ({ count: item.count, name: item.date })));
    });
  }, []);
  return (
        <>
            <Histogram
                onClick={(el : {
                activeLabel: string
            }) => {
                  navigate(`/achievements/0/100/${el.activeLabel}/Stats${gameAppid ? `/${gameAppid}` : '/undefined'}`);
                }}
                data={data}/>
        </>
  );
};

export default AchTimeHistogram;

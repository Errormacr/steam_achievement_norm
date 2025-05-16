import React, { useEffect, useState } from 'react';
import Histogram from './Histogram';
import { HistogramValue } from '../interfaces/sharedProps';
import { ApiService } from '../services/api.services';
import { TimeAveragePercent } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const AchAccPercentHistogram : React.FC = () => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAveragePercent>(`user/${steamId}/avg-percent-by-time/`).then((data) => {
      setData(Object.entries(data).map(([key, item]) => ({ count: +item.toFixed(2), name: key })));
    });
  }, []);
  return (

            <Histogram
                onClick={(el : {
                activeLabel: string
            }) => {
                  navigate(`/Achievements/0/100/${el.activeLabel}/Stats/undefinded`);
                }}
                data={data}/>

  );
};

export default AchAccPercentHistogram;

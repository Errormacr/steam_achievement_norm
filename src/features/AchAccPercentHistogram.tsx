import React, { useEffect, useState } from 'react';
import Histogram from '../components/Histogram';
import { HistogramValue } from '../types/sharedProps';
import { ApiService } from '../services/api.services';
import { TimeAveragePercent } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AchAccPercentHistogram : React.FC = () => {
  const navigate = useNavigate();
  const [data,
    setData] = useState < HistogramValue[] >([]);
    const { t } = useTranslation();

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    ApiService.get < TimeAveragePercent >(`user/${steamId}/avg-percent-by-time/`).then((data) => {
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
                data={data}
                yLabel={t('percent')}
                />

  );
};

export default AchAccPercentHistogram;
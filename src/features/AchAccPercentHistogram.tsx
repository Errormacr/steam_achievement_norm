import React from 'react';
import Histogram from '../components/Histogram';
import { useAchAccPercentHistogramData } from '../hooks/useAchAccPercentHistogramData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AchAccPercentHistogram : React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAchAccPercentHistogramData();
  const { t } = useTranslation();

  if (isLoading) {
    return <div>{t('loading')}...</div>;
  }

  if (error) {
    return <div>{t('error')}: {error.message}</div>;
  }
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

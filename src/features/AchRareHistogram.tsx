import React from 'react';
import Histogram from '../components/Histogram';
import { useAchRareHistogramData } from '../hooks/useAchRareHistogramData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AchRareHistogramProps {
  gameAppid?: number;
}

const AchRareHistogram: React.FC<AchRareHistogramProps> = ({ gameAppid }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAchRareHistogramData(gameAppid);
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
                  const addUrl = gameAppid ? `/${gameAppid}` : '/undefined';
                  const [min,
                    max] = el
                    .activeLabel
                    .slice(0, -1)
                    .split('-');
                  navigate(`/achievements/${min}/${max}/undefined/Stats${addUrl}`);
                }}
                data={data}
                yLabel={t('count')}
                />
  );
};

export default AchRareHistogram;

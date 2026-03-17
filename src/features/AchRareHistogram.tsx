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
                  const label = String(el.activeLabel || '');
                  console.log(label);
                  const cleaned = label.endsWith('%') ? label.slice(0, -1) : label;
                  const parts = cleaned.split('-').filter(Boolean);
                  const min = parts[0] ?? cleaned;
                  const max = parts[1] ?? parts[0] ?? cleaned;
                  if (!min) return;
                  navigate(`/achievements/${min}/${max}/undefined/Stats${addUrl}`);
                }}
                data={data}
                yLabel={t('count')}
                />
  );
};

export default AchRareHistogram;

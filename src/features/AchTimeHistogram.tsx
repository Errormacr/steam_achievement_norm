import React from 'react';
import Histogram from '../components/Histogram';
import { useNavigate } from 'react-router-dom';
import { useTimeAchievementHistogramData } from '../hooks/useTimeAchievementHistogramData';

interface AchTimeHistogramProps {
  gameAppid?: number;
}

const AchTimeHistogram: React.FC<AchTimeHistogramProps> = ({ gameAppid }) => {
  const navigate = useNavigate();
  const data = useTimeAchievementHistogramData(gameAppid);

  const handleClick = (el: { activeLabel: string }) => {
    const gameUrl = gameAppid ? `/${gameAppid}` : '/undefined';
    navigate(`/achievements/0/100/${el.activeLabel}/Stats${gameUrl}`);
  };

  return (
    <Histogram
      onClick={handleClick}
      data={data}
    />
  );
};

export default AchTimeHistogram;

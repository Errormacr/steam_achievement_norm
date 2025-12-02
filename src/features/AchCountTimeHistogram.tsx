import React from 'react';
import Histogram from '../components/Histogram';
import { useNavigate } from 'react-router-dom';
import { useTimeAchievementCount } from '../hooks/useTimeAchievementCount';

interface HistogramClickEvent {
  activeLabel: string;
}

interface AchCountTimeHistogramProps {
  gameAppid?: number;
}

const AchCountTimeHistogram: React.FC<AchCountTimeHistogramProps> = ({ gameAppid }) => {
  const navigate = useNavigate();
  const data = useTimeAchievementCount(gameAppid);

  const handleHistogramClick = (event: HistogramClickEvent) => {
    const gameUrl = gameAppid ? `/${gameAppid}` : '/undefinded';
    navigate(
      `/achievements/0/100/${event.activeLabel}/Stats${gameUrl}`
    );
  };

  return <Histogram onClick={handleHistogramClick} data={data} />;
};

export default AchCountTimeHistogram;

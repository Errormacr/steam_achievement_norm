import React from 'react';
import Table from '../components/Table';
import AchBox from './AchContainer';

interface AchievementsDisplayProps {
    tableOrBox: boolean;
    minPercent?: number;
    maxPercent?: number;
    date?: string;
    appid?: number;
    unlocked: boolean;
    all: boolean;
}

const AchievementsDisplay: React.FC<AchievementsDisplayProps> = ({
  tableOrBox,
  minPercent,
  maxPercent,
  date,
  appid,
  unlocked,
  all
}) => {
  const commonProps = {
    minPercent,
    maxPercent,
    date,
    appid,
    unlocked,
    all
  };

  return tableOrBox
    ? <Table {...commonProps} />
    : <AchBox {...commonProps} />;
};

export default AchievementsDisplay;

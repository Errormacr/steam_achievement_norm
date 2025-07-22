import React from 'react';
import AchTimeHistogram from './AchTimeHistogram';
import AchCountTimeHistogram from './AchCountTimeHistogram';
import AchAccPercentHistogram from './AchAccPercentHistogram';
import { statsComponentProps } from '../interfaces';

const StatsTimeAch: React.FC<statsComponentProps> = ({ gameAppid }) => {
  return (
    <>
      <div className='stats-chart'>
        <span className='stats-chart-title'>Количество достижений полученных за день</span>
        <AchTimeHistogram gameAppid={gameAppid} />
      </div>
      <div className='stats-chart'>
        <span className='stats-chart-title'>Общее количество достижений за день</span>
        <AchCountTimeHistogram gameAppid={gameAppid}/>
      </div>
      {!gameAppid && (
        <div className='stats-chart'>
          <span className='stats-chart-title'>Средний процент достижений аккаунта по дням</span>
          <AchAccPercentHistogram/>
        </div>
      )}

    </>
  );
};

export default StatsTimeAch;

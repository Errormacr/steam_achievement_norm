import React from 'react';
import AchTimeHistogram from './AchTimeHistogram';
import AchCountTimeHistogram from './AchCountTimeHistogram';
import AchAccPercentHistogram from './AchAccPercentHistogram';

const StatsTimeAch:React.FC = () => {
  return (
      <>
      <div className='stats-chart'>
          <span className='stats-chart-title'>Количество достижений полученных за день</span>
          <AchTimeHistogram/>
      </div>
      <div className='stats-chart'>
          <span className='stats-chart-title'>Общее количество достижений за день</span>
          <AchCountTimeHistogram/>
      </div>
      <div className='stats-chart'>
          <span className='stats-chart-title'>Средний процент достижений аккаунта по дням</span>
          <AchAccPercentHistogram/>
      </div>
      </>
  );
};

export default StatsTimeAch;

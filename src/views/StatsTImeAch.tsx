import React from 'react';
import AchTimeHistogram from './AchTimeHistogram';

const StatsTimeAch:React.FC = () => {
  return (
      <>
        <div className='stats-chart'>
          <AchTimeHistogram/>
        </div>
      </>
  );
};

export default StatsTimeAch;

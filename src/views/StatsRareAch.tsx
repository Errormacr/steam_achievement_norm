import React from 'react';
import AchRareDiagram from './AchRareDiagram';
import AchRareHistogram from './AchRareHistogram';

const StatsRareAch:React.FC = () => {
  return (
    <>
      <div className='stats-chart'>
        <span className='stats-chart-title'>Частота достижений по уровням редкости</span>
        <AchRareDiagram />
      </div>

      <div className='stats-chart'>
        <span className='stats-chart-title'>Распределение достижений по игрокам в процентах</span>
        <AchRareHistogram />
      </div>
      </>
  );
};

export default StatsRareAch;

import React from 'react';
import AchRareDiagram from './AchRareDiagram';
import AchRareHistogram from './AchRareHistogram';
import { StatsComponentProps } from '../interfaces';

const StatsRareAch:React.FC <StatsComponentProps> = ({ gameAppid }) => {
  return (
    <>
      <div className='stats-chart'>
        <span className='stats-chart-title'>Частота достижений по уровням редкости</span>
        <AchRareDiagram gameAppid={gameAppid}/>
      </div>

      <div className='stats-chart'>
        <span className='stats-chart-title'>Распределение достижений по игрокам в процентах</span>
        <AchRareHistogram gameAppid={gameAppid}/>
      </div>
      </>
  );
};

export default StatsRareAch;

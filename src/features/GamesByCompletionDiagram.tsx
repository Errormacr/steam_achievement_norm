import React from 'react';
import { useGamesByCompletion } from '../hooks/useGamesByCompletion';
import { Typography } from '@mui/material';

export default function GamesByCompletionDiagram() {
  const data = useGamesByCompletion();

  const maxValue = Math.max(...data.map(d => d.count), 0);

  return (
    <div style={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%', width: '100%' }}>
        {data.map((item) => (
          <div key={item.range} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <Typography variant="caption">{item.count}</Typography>
            <div style={{ height: `${(item.count / maxValue) * 80}%`, width: '50px', backgroundColor: '#3f51b5' }} />
            <Typography variant="caption">{item.range}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

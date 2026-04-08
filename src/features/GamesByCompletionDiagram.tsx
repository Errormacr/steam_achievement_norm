import React from 'react';
import { useGamesByCompletion } from '../hooks/useGamesByCompletion';
import { Typography } from '@mui/material';
import '../styles/scss/DashboardWidgets.scss';

export default function GamesByCompletionDiagram() {
  const data = useGamesByCompletion();

  const maxValue = Math.max(...data.map(d => d.count), 0);

  return (
    <div className="chart-center chart-center--bars">
      <div className="completion-bars">
        {data.map((item) => (
          <div key={item.range} className="completion-bars__item">
            <Typography variant="caption">{item.count}</Typography>
            <div className="completion-bars__bar" style={{ height: `${(item.count / maxValue) * 80}%` }} />
            <Typography variant="caption">{item.range}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

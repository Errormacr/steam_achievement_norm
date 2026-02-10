import React from 'react';
import { SliceTooltipProps } from '@nivo/line';

interface HistogramTooltipProps {
  slice: SliceTooltipProps['slice'];
  yLabel: string;
}

export const HistogramTooltip: React.FC<HistogramTooltipProps> = ({ slice, yLabel }) => {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        padding: '9px 12px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        minWidth: 150,
        whiteSpace: 'nowrap'
      }}
    >
      {slice.points.map((point) => (
        <div key={point.id}>
          <div>Date: {point.data.xFormatted}</div>
          <div>
            {yLabel}: {point.data.yFormatted}
          </div>
        </div>
      ))}
    </div>
  );
};

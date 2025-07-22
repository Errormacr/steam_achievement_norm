import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/scss/Histogram.scss';

interface HistogramProps {
  data: Array<{
    name: string | number;
    count: number;
  }>;
  onClick?: (event: any) => void;
}

const Histogram: React.FC<HistogramProps> = ({ data, onClick }) => {
  const [startIndex, setStartIndex] = useState(0);
  const windowSize = 30;
  const visibleData = data.slice(startIndex, startIndex + windowSize);
  const leftValue = data[startIndex]?.name || '';
  const rightValue = data[Math.min(startIndex + windowSize - 1, data.length - 1)]?.name || '';

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartIndex(parseInt(event.target.value));
  };

  return (
    <div className="histogram">
      {data.length > windowSize && (
        <div className="histogram-slider">
          <span className="histogram-slider-left-value">{leftValue}</span>
          <input
            className="histogram-slider-range"
            type="range"
            min="0"
            max={Math.max(data.length - windowSize, 0)}
            value={startIndex}
            onChange={handleSliderChange}
          />
          <span className="histogram-slider-right-value">{rightValue}</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart onClick={onClick} data={visibleData}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            activeDot={{ r: 4 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Histogram;

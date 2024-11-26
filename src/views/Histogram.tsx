import React, { useState, useEffect } from 'react';
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
import './scss/Histogram.scss';
import { HistogramProps } from '../interfaces/sharedProps';

const Histogram : React.FC < HistogramProps > = ({ data }) => {
  const [startIndex,
    setStartIndex] = useState(0);
  const [windowSize,
    setWindowSize] = useState(10); // Изначально размер окна

  const useWindowDimensions = () => {
    const [windowDimensions,
      setWindowDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return windowDimensions;
  };

  const { width } = useWindowDimensions();

  useEffect(() => {
    const calculatedWindowSize = Math.floor(width / 50);
    setWindowSize(calculatedWindowSize > 10
      ? calculatedWindowSize
      : 10);
  }, [width]);

  const visibleData = data.slice(startIndex, startIndex + windowSize);

  const handleSliderChange = (event : React.ChangeEvent < HTMLInputElement >) => {
    setStartIndex(Number(event.target.value));
  };
  const leftValue = visibleData.length > 0
    ? visibleData[0].name
    : '';
  const rightValue = visibleData.length > 0
    ? visibleData[visibleData.length - 1].name
    : '';

  return (
        <div className='histogram'>
            {data.length > windowSize && (
                <div className='histogram-slider'>
                    <span className='histogram-slider-left-value'>{leftValue}</span>
                    <input
                        className='histogram-slider-range'
                        type="range"
                        min="0"
                        max={Math.max(data.length - windowSize, 0)}
                        value={startIndex}
                        onChange={handleSliderChange}/>
                    <span className='histogram-slider-right-value'>{rightValue}</span>
                </div>
            )}
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={visibleData}>
                    <CartesianGrid strokeDasharray="2 2"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        activeDot={{
                          r: 8
                        }}
                        animationDuration={500}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
  );
};

export default Histogram;

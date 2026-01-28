import React, { useMemo, useState } from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import '../styles/scss/Histogram.scss';

type OnClick = any;

interface HistogramProps {
  data: Array<{
    name: string | number;
    count: number;
  }>;
  onClick?: OnClick;
}

const Histogram: React.FC<HistogramProps> = ({ data, onClick }) => {
  const [startIndex, setStartIndex] = useState(0);
  const windowSize = 30;

  const transformedData: Serie[] = useMemo(
    () => [
      {
        id: 'histogram',
        data: data.map((item) => ({ x: item.name, y: item.count }))
      }
    ],
    [data]
  );

  const visibleData = useMemo(
    () => [
      {
        ...transformedData[0],
        data: transformedData[0].data.slice(startIndex, startIndex + windowSize)
      }
    ],
    [startIndex, transformedData]
  );

  const leftValue = data[startIndex]?.name || '';
  const rightValue =
    data[Math.min(startIndex + windowSize - 1, data.length - 1)]?.name || '';

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartIndex(Number.parseInt(event.target.value));
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
      <ResponsiveLine
        data={visibleData}
        onClick={onClick}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Date',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices="x"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          textColor: 'rgb(var(--color-text-primary))',
          tooltip: {
            container: {
              background: 'rgb(var(--color-background-secondary))',
              color: 'rgb(var(--color-text-primary))'
            }
          }
        }}
      />
    </div>
  );
};

export default Histogram;

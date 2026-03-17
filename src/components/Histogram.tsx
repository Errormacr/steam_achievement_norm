import React, { useMemo, useState } from 'react';
import { ResponsiveLine, LineSeries, SliceTooltipProps } from '@nivo/line';
import { HistogramTooltip } from './HistogramTooltip';
import '../styles/scss/Histogram.scss';

interface HistogramProps {
  data: Array<{
    name: string | number;
    count: number;
  }>;
  onClick?: any;
  yLabel?: string;
}

interface HistogramChartProps {
  data: LineSeries[];
  onClick?: any;
  yLabel?: string;
}

const HistogramChart: React.FC<HistogramChartProps> = ({ data, onClick, yLabel }) => {
  const slicing = ({ slice }: SliceTooltipProps<LineSeries>) => <HistogramTooltip slice={slice} yLabel={yLabel} />;
  const handlePointClick = (point: any) => {
    if (!onClick) return;
    const label = point.points[0].data.x
    if (label == null) return;
    onClick({ activeLabel: String(label), raw: point });
  };
  return (
    <ResponsiveLine
      data={data}
      onClick={handlePointClick}
      curve="monotoneX"
      margin={{ top: 35, right: 110, bottom: 115, left: 60 }}
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
        legendOffset: 46,
        legendPosition: 'middle'
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={4}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices="x"
      sliceTooltip={slicing}
      theme={{
        text: { color: 'var(--text-primary)' },
        axis: {
          domain: {
            line: {
              stroke: 'var(--text-primary)'
            }
          },
          ticks: {
            line: {
              stroke: 'var(--text-primary)',
              strokeWidth: 1
            },
            text: {
              fill: 'var(--text-primary)'
            }
          },
          legend: {
            text: {
              fill: 'var(--text-primary)'
            }
          }
        },
        legends: {
          text: {
            fill: 'var(--text-primary)'
          }
        },
        tooltip: {
          container: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
          }
        }
      }}
    />
  );
};

const Histogram: React.FC<HistogramProps> = ({ data, onClick, yLabel = 'Count' }) => {
  const [startIndex, setStartIndex] = useState(0);
  const windowSize = 30;

  const transformedData: LineSeries[] = useMemo(
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
      <HistogramChart data={visibleData} onClick={onClick} yLabel={yLabel} />
    </div>
  );
};

export default Histogram;

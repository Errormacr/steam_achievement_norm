import React from 'react';
import { Group } from '@visx/group';
import genBins, { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';
import { scaleLinear } from '@visx/scale';
import { HeatmapRect } from '@visx/heatmap';
import { getSeededRandom } from '@visx/mock-data';

const cool1 = '#ffffff';
const cool2 = '#130a0a';
export const background = '#3a4c62';

const seededRandom = getSeededRandom(0.41);

const binData = genBins(
  /* length = */ 120,
  /* height = */ 7,
  /** binFunc */ (idx) => 150 * idx,
  /** countFunc */ (i, number) => 25 * (number - i) * seededRandom()
);

function max<Datum> (data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

// accessors
const bins = (d: Bins) => d.bins;
const count = (d: Bin) => d.count;

const colorMax = max(binData, (d) => max(bins(d), count));
const bucketSizeMax = max(binData, (d) => bins(d).length);

// scales
const xScale = scaleLinear<number>({
  domain: [0, binData.length]
});
const yScale = scaleLinear<number>({
  domain: [0, bucketSizeMax]
});
const rectColorScale = scaleLinear<string>({
  range: [cool1, cool2],
  domain: [0, colorMax]
});
const opacityScale = scaleLinear<number>({
  range: [0.1, 1],
  domain: [0, colorMax]
});

export type HeatmapProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 70 };

export function Heatmap ({
  width,
  height,
  events = false,
  margin = defaultMargin
}: HeatmapProps) {
  // bounds
  const yMax = height - margin.bottom - margin.top;

  // Calculate uniform bin size for square cells
  const binSize = 48;
  const binWidth = binSize;
  const binHeight = binSize;

  xScale.range([0, binWidth * binData.length]);
  yScale.range([yMax, 0]);

  // Width of the full heatmap to enable scrolling
  const fullWidth = binWidth * binData.length + margin.left + margin.right;

  return (
    <div
      style={{
        width: `${width}px`,
        overflowX: 'auto', // Enable horizontal scrolling
        padding: '5px'
      }}
    >
      <svg width={fullWidth} height={height}>
        <rect x={0} y={0} width={fullWidth} height={height} rx={14} fill={background} />
        <Group left={margin.left}>
          <HeatmapRect
            data={binData}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            colorScale={rectColorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={0} // Ensure no gaps
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin: any) => (
                  <rect
                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                    width={binWidth}
                    height={binHeight}
                    style={{ border: '1px solid aqua' }}
                    x={bin.column * binWidth}
                    y={50 + bin.row * binHeight}
                    fill={bin.color}
                    fillOpacity={bin.opacity}
                    onClick={() => {
                      if (!events) return;
                      const { row, column } = bin;
                      alert(JSON.stringify({ row, column, bin: bin.bin }));
                    }}
                  />
                ))
              )
            }
          </HeatmapRect>
        </Group>
      </svg>
    </div>
  );
}

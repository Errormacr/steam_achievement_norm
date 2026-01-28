import React, { useState } from 'react';

interface PieDataItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface CustomPieChartProps {
  data: PieDataItem[];
  width: number;
  height: number;
  innerRadius?: number;
  outerRadius?: number;
}

const RADIAN = Math.PI / 180;

const getArc = (cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const start = {
        x: cx + outerRadius * Math.cos(startAngle * RADIAN),
        y: cy + outerRadius * Math.sin(startAngle * RADIAN),
    };
    const end = {
        x: cx + outerRadius * Math.cos(endAngle * RADIAN),
        y: cy + outerRadius * Math.sin(endAngle * RADIAN),
    };
    const innerStart = {
        x: cx + innerRadius * Math.cos(endAngle * RADIAN),
        y: cy + innerRadius * Math.sin(endAngle * RADIAN),
    };
    const innerEnd = {
        x: cx + innerRadius * Math.cos(startAngle * RADIAN),
        y: cy + innerRadius * Math.sin(startAngle * RADIAN),
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${start.x} ${start.y}
            A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
            L ${innerStart.x} ${innerStart.y}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}
            Z`;
};

const Sector: React.FC<any> = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => {
  const activeOuterRadius = outerRadius + 10;

  if (isActive) {
    const sin = Math.sin(-RADIAN * ((startAngle + endAngle) / 2));
    const cos = Math.cos(-RADIAN * ((startAngle + endAngle) / 2));
    const sx = cx + (activeOuterRadius + 10) * cos;
    const sy = cy + (activeOuterRadius + 10) * sin;
    const mx = cx + (activeOuterRadius + 30) * cos;
    const my = cy + (activeOuterRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g onMouseLeave={onMouseLeave} style={{ cursor: 'pointer' }} filter="url(#shadow)">
        <path
          d={getArc(cx, cy, innerRadius, activeOuterRadius, startAngle, endAngle)}
          fill={fill}
          style={{ transition: 'd 0.3s ease' }}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="white"
          fontSize="12px"
        >{`${payload.label}: ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="white"
          fontSize="12px"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }

  return (
    <path
      d={getArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
      fill={fill}
      onMouseEnter={onMouseEnter}
      style={{ cursor: 'pointer', transition: 'd 0.3s ease' }}
    />
  );
};

const Legend: React.FC<{ data: PieDataItem[], activeIndex: number | null, setActiveIndex: (index: number | null) => void }> = ({ data, activeIndex, setActiveIndex }) => {
    const itemWidth = 120;
    const totalWidth = data.length * itemWidth;

    return (
        <g transform={`translate(-${totalWidth / 2}, 0)`}>
            {data.map((entry, index) => (
                <g
                    key={`legend-${entry.id}`}
                    transform={`translate(${index * itemWidth}, 0)`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    style={{ cursor: 'pointer', opacity: activeIndex === null || activeIndex === index ? 1 : 0.5 }}
                >
                    <rect width="18" height="18" fill={entry.color} />
                    <text
                        x="24"
                        y="9"
                        dy="0.35em"
                        fill="white"
                        fontSize="12px"
                    >
                        {entry.label}
                    </text>
                </g>
            ))}
        </g>
    )
}

export const CustomPieChart: React.FC<CustomPieChartProps> = ({
  data,
  width,
  height,
  innerRadius = 80,
  outerRadius = 110,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return <div style={{ width, height, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No data to display</div>;


  let currentAngle = -90; // Start from top
  const pieSectors = data.map((item) => {
    const angle = (item.value / total) * 360;
    const sector = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percent: item.value / total,
    };
    currentAngle += angle;
    return sector;
  });

  const legendHeight = 50;
  const pieHeight = height - legendHeight;
  const cx = width / 2;
  const cy = pieHeight / 2;

  return (
    <svg width={width} height={height}>
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={pieSectors[activeIndex]?.color || 'grey'} floodOpacity="0.7" />
        </filter>
      </defs>
      <g transform={`translate(${cx}, ${cy})`}>
        {pieSectors.map((sector, index) => (
          <Sector
            key={sector.id}
            cx={0}
            cy={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={sector.startAngle}
            endAngle={sector.endAngle}
            fill={sector.color}
            payload={sector}
            percent={sector.percent}
            value={sector.value}
            isActive={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          />
        ))}
      </g>
      <g transform={`translate(${cx}, ${pieHeight + 20})`}>
          <Legend data={data} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </g>
    </svg>
  );
};

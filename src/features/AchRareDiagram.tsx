import React, { useCallback, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { useTranslation } from 'react-i18next';
import { StatsComponentProps } from '../interfaces';
import { useRareAchievementCount } from '../hooks/useRareAchievementCount';
import { RARE_ACHIEVEMENT_CATEGORIES } from '../constants/achRareDiagram';

interface PieData {
    id: string;
    name: string;
    value: number;
    color: string;
}

interface ShapeProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: PieData;
    percent: number;
    value: number;
}

const renderActiveShape = (props: ShapeProps, t: (key: string) => string) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
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
            >{`${t('count')}: ${value}`}</text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#999"
            >
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
  );
};

export default function AchRareDiagram ({ gameAppid }: Readonly<StatsComponentProps>) {
  const { t } = useTranslation();
  const counts = useRareAchievementCount(gameAppid);
  const [activeIndex, setActiveIndex] = useState(0);

  const dataToShow: PieData[] = RARE_ACHIEVEMENT_CATEGORIES.map(section => ({
    id: section.apiKey,
    name: t(section.nameKey),
    value: counts[section.apiKey] || 0,
    color: section.color
  }));

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  const activeShape = useCallback((props: ShapeProps) => {
    return renderActiveShape(props, t);
  }, [t]);

  return (
        <ResponsiveContainer width={600} height={300}>
            <PieChart width={400} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={activeShape}
                    data={dataToShow}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {dataToShow.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                </Pie>
                <Legend align="left" verticalAlign="middle" layout="vertical" />
            </PieChart>
        </ResponsiveContainer>
  );
}

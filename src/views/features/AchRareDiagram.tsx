import React, { useCallback, useEffect, useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { ApiService } from '../../services/api.services';
import { RareAchievementCount, statsComponentProps } from '../../interfaces';

interface Ach {
    id: string;
    name: string;
    value: number;
    color: string;
}

interface shapeProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: { name: string };
    percent: number;
    value: number;
}

export default function AchRareDiagram ({ gameAppid = undefined }: statsComponentProps) {
  const { t } = useTranslation();

  const renderActiveShape = (props: shapeProps) => {
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
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
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
  const [dataToShow, setDataToShow] = useState<Ach[]>([
    { id: '60-100%', name: t('Common'), value: 0, color: '#00b500' },
    { id: '45-60%', name: t('Uncommon'), value: 0, color: '#4DDD4D' },
    { id: '20-45%', name: t('Rare'), value: 0, color: '#0000FF' },
    { id: '5-20%', name: t('Epic'), value: 0, color: '#800080' },
    { id: '0-5%', name: t('Legendary'), value: 0, color: 'rgb(255,184,78)' }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const renderComponent = useCallback(async () => {
    try {
      const steamId = localStorage.getItem('steamId');
      const gameAppidQuery = gameAppid ? `appid=${gameAppid}` : '';
      const dataFromApi = await ApiService.get<RareAchievementCount>(`user/achievements-rare-count/${steamId}?percents=5&percents=20&percents=45&percents=60&` + gameAppidQuery);

      const updatedDataToShow = dataToShow.map((item, index) => ({
        ...item,
        value: Object.values(dataFromApi)[4 - index] || 0
      }));

      setDataToShow(updatedDataToShow);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [dataToShow]);

  useEffect(() => {
    renderComponent();
  }, []);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };
  return (
        <ResponsiveContainer width={600} height={300}>
            <PieChart width={400} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={dataToShow}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {dataToShow.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={dataToShow[index].color}/>
                    ))}
                </Pie>
                <Legend align='left' verticalAlign='middle' layout='vertical'/>
            </PieChart>
        </ResponsiveContainer>
  );
}

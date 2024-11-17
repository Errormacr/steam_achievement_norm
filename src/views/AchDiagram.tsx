import React, { useCallback, useEffect, useState } from 'react';
import i18n from '../transate';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
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

export default function Diagram () {
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
      payload,
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
        <text
          color="white"
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
        >
          {payload.name}
        </text>
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
        >{`Count: ${value}`}</text>
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
    { id: '0-5%', name: '0-5%', value: 0, color: 'rgb(255,184,78)' },
    { id: '5-20%', name: '5-20%', value: 0, color: '#800080' },
    { id: '20-45%', name: '20-45%', value: 0, color: '#0000FF' },
    { id: '45-60%', name: '45-60%', value: 0, color: '#4DDD4D' },
    { id: '60-100%', name: '60-100%', value: 0, color: '#00b500' }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const renderComponent = useCallback(async () => {
    try {
      const steamId = localStorage.getItem('steamId');
      const baseUrl = `http://localhost:8888/api/user/${steamId}/achievements?orderBy=unlockedDate&desc=1&language=${i18n.language}&unlocked=1&page=1&pageSize=0&`;
      const urls = [
        `${baseUrl}percentMin=0&percentMax=5`,
        `${baseUrl}percentMin=5&percentMax=20`,
        `${baseUrl}percentMin=20&percentMax=45`,
        `${baseUrl}percentMin=45&percentMax=60`,
        `${baseUrl}percentMin=60&percentMax=100`
      ];

      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const dataFromApi = await Promise.all(
        responses.map((response) => response.json())
      );
      const achievementCounts = dataFromApi.map((data) => data.count);

      // Update dataToShow with the counts
      const updatedDataToShow = dataToShow.map((item, index) => ({
        ...item,
        value: achievementCounts[index] || 0
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
    <ResponsiveContainer width="100%" height="100%">
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
            <Cell key={`cell-${index}`} fill={dataToShow[index].color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

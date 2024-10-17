import React, { useCallback, useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import i18n from '../transate';

interface Ach {
  id: string;
  label: string;
  value: number;
  color: string;
}

export default function Diagram () {
  const [achCount, setAchCount] = useState(1);
  const [dataToShow, setDataToShow] = useState<Ach[]>([
    { id: '60-100%', label: '60-100%', value: 0, color: '#00b500' },
    { id: '45-60%', label: '45-60%', value: 0, color: '#4DDD4D' },
    { id: '20-45%', label: '20-45%', value: 0, color: '#0000FF' },
    { id: '5-20%', label: '5-20%', value: 0, color: '#800080' },
    { id: '0-5%', label: '0-5%', value: 0, color: 'rgb(255,184,78)' }
  ]);

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

      const responses = await Promise.all(urls.map(url => fetch(url)));
      const dataFromApi = await Promise.all(responses.map(response => response.json()));

      const achievementCounts = dataFromApi.map(data => data.count);

      // Update dataToShow with the counts
      const updatedDataToShow = dataToShow.map((item, index) => ({
        ...item,
        value: achievementCounts[4 - index] || 0
      }));

      setDataToShow(updatedDataToShow);
      setAchCount(achievementCounts.reduce((total, count) => total + count, 0));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [dataToShow]);

  useEffect(() => {
    renderComponent();
  }, []);

  useEffect(() => {
    console.log('Data to show:', dataToShow);
    console.log('Achievement count:', achCount);
  }, [dataToShow, achCount]);

  return (
    <ResponsivePie
      data={dataToShow}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      colors={{ datum: 'data.color' }}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]]
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#FFFFFF"
      arcLinkLabelsThickness={2}
      arcLabel={e => `${(e.value / achCount * 100).toFixed(2)}%`}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]]
      }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      fill={[
        { match: { id: 'ruby' }, id: 'dots' },
        { match: { id: 'c' }, id: 'dots' },
        { match: { id: 'go' }, id: 'dots' },
        { match: { id: 'elixir' }, id: 'lines' },
        { match: { id: 'javascript' }, id: 'lines' }
      ]}
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: { itemTextColor: '#000' }
            }
          ]
        }
      ]}
    />
  );
}

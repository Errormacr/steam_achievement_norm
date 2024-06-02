
import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface Ach {
id: string;
label: string;
value: number,
color: string
}

export default function Diagram () {
  const games = localStorage.getItem('ach');
  const gamesArr = JSON.parse(games || '[]');
  const dataToShow : Ach[] = [

    {
      id: '60-100%',
      label: '60-100%',
      value: 0,
      color: '#00b500'
    }, {
      id: '45-60%',
      label: '45-60%',
      value: 0,
      color: '#4DDD4D'
    }, {
      id: '20-45%',
      label: '20-45%',
      value: 0,
      color: '#0000FF'
    }, {
      id: '5-20%',
      label: '5-20%',
      value: 0,
      color: '#800080'
    }, {
      id: '0-5%',
      label: '0-5%',
      value: 0,
      color: 'rgb(255,184,78)'
    }];
  const aches = gamesArr.flatMap((game) => game.Achievement).filter((ach) => (ach.achieved));
  aches.forEach((ach) => {
    if (ach.percent <= 5) {
      dataToShow[4].value += 1;
    } else if (ach.percent > 5 && ach.percent <= 20) {
      dataToShow[3].value += 1;
    } else if (ach.percent > 20 && ach.percent <= 45) {
      dataToShow[2].value += 1;
    } else if (ach.percent > 45 && ach.percent <= 60) {
      dataToShow[1].value += 1;
    } else {
      dataToShow[0].value += 1;
    }
  });

  console.log(`${new Date().getFullYear()}-1-1`);
  return (
    <ResponsivePie
    data={dataToShow}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    colors={{ datum: 'data.color' }}
    borderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          0.2
        ]
      ]
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#FFFFFF"
    arcLinkLabelsThickness={2}
    arcLabel={e => `${(e.value / aches.length * 100).toFixed(2)}%`}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          2
        ]
      ]
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
      {
        match: {
          id: 'ruby'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'c'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'go'
        },
        id: 'dots'
      },

      {
        match: {
          id: 'elixir'
        },
        id: 'lines'
      },
      {
        match: {
          id: 'javascript'
        },
        id: 'lines'
      }
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
            style: {
              itemTextColor: '#000'
            }
          }
        ]
      }
    ]}
/>
  );
}


import React from 'react';
import { UnixTimestampToDate } from './GameCard';
import { ResponsiveLine } from '@nivo/line';
interface achDayRare {
    [key: string]: {achCount: number, rare: number}
}
export default function Diagram () {
  const games = localStorage.getItem('ach');
  const gamesArr = JSON.parse(games || '[]');
  const achArr = gamesArr.flatMap((game) => game.Achievement).filter((ach) => (ach.achieved)).sort((a, b) => a.unlocktime - b.unlocktime);
  const achWithCountRare: achDayRare = {};
  const achWithoutUnlockTime = {
    achCount: 0,
    rare: 0
  };
  const dataToShow = [];
  achArr.forEach((ach) => {
    const day = UnixTimestampToDate(ach.unlocktime);
    if (!ach.unlocktime) {
      achWithoutUnlockTime.achCount += 1;
      achWithoutUnlockTime.rare += ach.percent;
    } else if (achWithCountRare[day]) {
      achWithCountRare[day].achCount += 1;
      achWithCountRare[day].rare += ach.percent;
    } else {
      achWithCountRare[day] = {
        achCount: 1,
        rare: ach.percent
      };
    }
  });
  let achCount = 0;
  let rare = 0;
  for (const key in achWithCountRare) {
    if (Object.prototype.hasOwnProperty.call(achWithCountRare, key)) { // Проверка, чтобы не перечислять унаследованные свойства
      const value = achWithCountRare[key];
      achCount += value.achCount;
      rare += value.rare;
      dataToShow.push({
        x: key,
        y: rare / achCount
      });
    }
  }
  console.log(dataToShow);
  const data = [
    {
      id: 'Achievements',
      color: 'hsl(165, 80%, 50%)',
      data: dataToShow
    }];
  return (
    <ResponsiveLine
    data={data}
    theme={{
      background: '#1b2838',
      text: {
        fontSize: 11,
        fill: '#f4f1f1',
        outlineWidth: 0,
        outlineColor: '#ffffff'
      },
      axis: {
        domain: {
          line: {
            stroke: '#f7f7f7',
            strokeWidth: 1
          }
        },
        legend: {
          text: {
            fontSize: 12,
            fill: '#f5f5f5',
            outlineWidth: 0,
            outlineColor: '#ffffff'
          }
        },
        ticks: {
          line: {
            stroke: '#777777',
            strokeWidth: 1
          },
          text: {
            fontSize: 11,
            fill: '#ffffff',
            outlineWidth: 0,
            outlineColor: '#ebe6e6'
          }
        }
      },
      grid: {
        line: {
          stroke: '#dddddd',
          strokeWidth: 1
        }
      },
      legends: {
        title: {
          text: {
            fontSize: 11,
            fill: '#333333',
            outlineWidth: 0,
            outlineColor: 'transparent'
          }
        },
        text: {
          fontSize: 11,
          fill: '#fff0f0',
          outlineWidth: 0,
          outlineColor: '#ffffff'
        },
        ticks: {
          line: {},
          text: {
            fontSize: 10,
            fill: '#333333',
            outlineWidth: 0,
            outlineColor: 'transparent'
          }
        }
      },
      annotations: {
        text: {
          fontSize: 13,
          fill: '#333333',
          outlineWidth: 2,
          outlineColor: '#ffffff',
          outlineOpacity: 1
        },
        link: {
          stroke: '#000000',
          strokeWidth: 1,
          outlineWidth: 2,
          outlineColor: '#ffffff',
          outlineOpacity: 1
        },
        outline: {
          stroke: '#000000',
          strokeWidth: 2,
          outlineWidth: 2,
          outlineColor: '#ffffff',
          outlineOpacity: 1
        },
        symbol: {
          fill: '#000000',
          outlineWidth: 2,
          outlineColor: '#ffffff',
          outlineOpacity: 1
        }
      },
      tooltip: {
        container: {
          background: '#ffffff',
          color: '#333333',
          fontSize: 12
        },
        basic: {},
        chip: {},
        table: {},
        tableCell: {},
        tableCellValue: {}
      }
    }}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle',
      truncateTickAt: 0
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle',
      truncateTickAt: 0
    }}
    enableGridX={false}
    enableGridY={false}
    colors={{ scheme: 'category10' }}
    lineWidth={10}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    areaBlendMode="darken"
    areaOpacity={0}
    enableTouchCrosshair={true}
    useMesh={true}
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
    motionConfig="molasses"
/>
  );
}

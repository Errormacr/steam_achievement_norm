import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation } from 'react-i18next';
import { useModal } from '../hooks/useModal';
import '../styles/scss/Modal.scss';
import '../styles/scss/_date-input.scss';
import { useGamesPercentsByTime } from '../hooks/useGamesPercentsByTime';
import { DateRangeControls } from './DateRangeControls';
import { GameSelectionModal } from './GameSelectionModal';
import GameButton from '../components/GameButton';

const GamesPercentsByTimeChart: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, allGames, isLoading } = useGamesPercentsByTime(startDate, endDate);

  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  useEffect(() => {
    const savedSelectionJSON = localStorage.getItem('selectedGamesForPercentsChart');
    if (savedSelectionJSON) {
      const savedSelection = JSON.parse(savedSelectionJSON);
      const validSelection = savedSelection.filter((g: string) => allGames.includes(g));
      setSelectedGames(validSelection);
      // Auto-select some games if the saved selection is empty but there is data
      if (validSelection.length === 0 && allGames.length > 0) {
        setSelectedGames(allGames.slice(0, Math.min(5, allGames.length)));
      }
    } else if (allGames.length > 0) {
      // Default selection for first-time users
      setSelectedGames(allGames.slice(0, Math.min(5, allGames.length)));
    }
  }, [allGames]);

  useEffect(() => {
    localStorage.setItem('selectedGamesForPercentsChart', JSON.stringify(selectedGames));
  }, [selectedGames]);

  const filteredData = data.filter(series => selectedGames.includes(series.id as string));

  return (
    <div style={{ height: '500px' }}>
      <GameButton onClick={openModal} id={'select-games'} text={t('selectGames')} />
      <DateRangeControls
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <GameSelectionModal
        isOpen={isOpen}
        onClose={closeModal}
        allGames={allGames}
        selectedGames={selectedGames}
        onApply={setSelectedGames}
      />

      {isLoading && <div>{t('loading')}...</div>}

      {!isLoading && filteredData.length > 0
        ? (
        <ResponsiveLine
          data={filteredData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 0,
            max: 100,
            stacked: false,
            reverse: false
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: t('date'),
            legendOffset: 45,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: t('percent'),
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
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
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
          )
        : (
            !isLoading && <div>{t('noGamesSelected')}</div>
          )}
    </div>
  );
};

export default GamesPercentsByTimeChart;

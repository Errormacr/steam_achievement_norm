import React, { useEffect, useState } from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import { ApiService } from '../services/api.services';
import { useTranslation } from 'react-i18next';
import { useModal } from '../hooks/useModal';
import '../styles/scss/Modal.scss';
import Portal from '../components/Portal';

interface GamesPercentsData {
  percents: Record<string, Record<number, number>>;
  names: Record<number, string>;
}

const PALETTE = [
  '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9'
];

function getColor(index: number) {
  return PALETTE[index % PALETTE.length];
}

const GamesPercentsByTimeChart: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Serie[]>([]);
  const [allGames, setAllGames] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [tempSelectedGames, setTempSelectedGames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { isOpen, openModal, closeModal } = useModal();
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) return;

    ApiService.get<GamesPercentsData>(
      `user/${steamId}/games-percents-by-time?startDate=${startDate}&endDate=${endDate}`
    ).then((response) => {
      if (!response || !response.percents) {
        return;
      }
      const { percents, names: gameNameMap } = response;

      const gameIdsInData = new Set<string>();
      Object.values(percents).forEach((dailyData) => {
        Object.keys(dailyData).forEach((appid) => {
          gameIdsInData.add(appid);
        });
      });

      const series = Array.from(gameIdsInData).map((appid, index) => {
        const numberAppid = Number(appid);
        const gameName = gameNameMap[numberAppid];
        const displayName = (gameName && gameName.trim()) ? gameName.trim() : `AppID: ${appid}`;
        
        return {
          id: displayName,
          color: getColor(index),
          data: Object.entries(percents).map(([date, dailyData]) => ({
            x: date,
            y: dailyData[numberAppid]?.toFixed(2) ?? null
          }))
        };
      });
      
      const gameNames = series.map(s => s.id as string);
      setAllGames(gameNames);
      setData(series);

      const savedSelectionJSON = localStorage.getItem('selectedGamesForPercentsChart');
      if (savedSelectionJSON) {
        const savedSelection = JSON.parse(savedSelectionJSON);
        const validSelection = savedSelection.filter((g: string) => gameNames.includes(g));
        setSelectedGames(validSelection);
        if (validSelection.length === 0 && gameNames.length > 0) {
          setSelectedGames(gameNames.slice(0, Math.min(5, gameNames.length)));
        }
      } else {
        setSelectedGames(gameNames.slice(0, Math.min(5, gameNames.length)));
      }
    });
  }, [startDate, endDate]);
  
  useEffect(() => {
    localStorage.setItem('selectedGamesForPercentsChart', JSON.stringify(selectedGames));
  }, [selectedGames]);

  const handleTempGameSelection = (gameName: string) => {
    setTempSelectedGames(prevSelected =>
      prevSelected.includes(gameName)
        ? prevSelected.filter(name => name !== gameName)
        : [...prevSelected, gameName]
    );
  };
  
  const handleOpenModal = () => {
    setTempSelectedGames(selectedGames);
    setSearchQuery('');
    openModal();
  };

  const handleApplySelection = () => {
    setSelectedGames(tempSelectedGames);
    closeModal();
  };

  const filteredData = data.filter(series => selectedGames.includes(series.id as string));

  const getFilteredGames = () => {
    return allGames.filter(gameName => gameName.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const handleSelectAllFiltered = () => {
    const filtered = getFilteredGames();
    setTempSelectedGames(prev => [...new Set([...prev, ...filtered])]);
  };

  const handleDeselectAllFiltered = () => {
    const filtered = getFilteredGames();
    setTempSelectedGames(prev => prev.filter(name => !filtered.includes(name)));
  };

  return (
    <div style={{ height: '500px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button onClick={handleOpenModal}>{t('selectGames')}</button>
        <div>
          <label htmlFor="startDate">{t('from')}: </label>
          <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="endDate">{t('to')}: </label>
          <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>
      {isOpen && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{t('selectGames')}</h3>
              <input
                type="text"
                placeholder={t('searchGames')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '90%', margin: '10px', padding: '5px' }}
              />
               <div className="modal-actions" style={{ justifyContent: 'flex-start', padding: '0 10px' }}>
                <button onClick={handleSelectAllFiltered}>{t('selectAllVisible')}</button>
                <button onClick={handleDeselectAllFiltered}>{t('deselectAllVisible')}</button>
              </div>
              <div className="modal-scrollable-content">
                {getFilteredGames().map(gameName => (
                  <label key={gameName} style={{ display: 'block', margin: '5px 0' }}>
                    <input
                      type="checkbox"
                      checked={tempSelectedGames.includes(gameName)}
                      onChange={() => handleTempGameSelection(gameName)}
                    />
                    {gameName}
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button onClick={handleApplySelection}>{t('apply')}</button>
                <button onClick={closeModal}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {filteredData.length > 0 ? (
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
          textColor: 'var(--text-primary)',
          axis: {
            domain: {
              line: {
                stroke: 'var(--text-primary)',
              },
            },
            ticks: {
              line: {
                stroke: 'var(--text-primary)',
                strokeWidth: 1,
              },
              text: {
                fill: 'var(--text-primary)',
              },
            },
            legend: {
              text: {
                fill: 'var(--text-primary)',
              },
            },
          },
          legends: {
            text: {
              fill: 'var(--text-primary)',
            },
          },
          tooltip: {
            container: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            },
          },
        }}
      />
      ) : (
        <div>{t('noGamesSelected')}</div>
      )}
    </div>
  );
};


export default GamesPercentsByTimeChart;

import { useState, useEffect } from 'react';
import { LineSeries } from '@nivo/line';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';

interface GamesPercentsData {
  percents: Record<string, Record<number, number>>;
  names: Record<number, string>;
}

const PALETTE = [
  '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9'
];

function getColor (index: number) {
  return PALETTE[index % PALETTE.length];
}

function processGamesData (percents: Record<string, Record<number, number>>, gameNameMap: Record<number, string>): { series: LineSeries[], gameNames: string[] } {
  const dates = Object.keys(percents);
  const gameIdsInData = new Set<string>();
  Object.values(percents).forEach((dailyData) => {
    Object.keys(dailyData).forEach((appid) => {
      gameIdsInData.add(appid);
    });
  });

  const series = Array.from(gameIdsInData).map((appid, index) => {
    const numberAppid = Number(appid);
    const gameName = gameNameMap[numberAppid];
    const displayName = gameName?.trim() || `AppID: ${appid}`;
    let lastKnownPercent: number | null = null;

    return {
      id: displayName,
      color: getColor(index),
      data: dates.map((date) => {
        const value = percents[date][numberAppid];
        if (value !== undefined) {
          lastKnownPercent = value;
        }
        return {
          x: date,
          y: lastKnownPercent
        };
      })
    };
  });

  const gameNames = series.map(s => s.id);
  return { series, gameNames };
}

export function useGamesPercentsByTime (startDate: string, endDate: string) {
  const [data, setData] = useState<LineSeries[]>([]);
  const [allGames, setAllGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    ApiService.get<GamesPercentsData>(
      `user/${steamId}/games-percents-by-time?startDate=${startDate}&endDate=${endDate}`
    ).then((response) => {
      if (!response?.percents || !response?.names) {
        setData([]);
        setAllGames([]);
        setIsLoading(false);
        return;
      }
      const { percents, names: gameNameMap } = response;

      const { series, gameNames } = processGamesData(percents, gameNameMap);
      setAllGames(gameNames.length > 0 ? gameNames : Object.values(gameNameMap));
      setData(series);
    }).catch(err => {
      logger.error('Failed to fetch games percents by time', err);
      setError(err);
      setData([]);
      setAllGames([]);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [startDate, endDate]);

  return { data, allGames, isLoading, error };
}

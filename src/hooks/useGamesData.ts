import { useState, useEffect, useCallback } from 'react';
import i18n from 'i18next';
import { ApiService } from '../services/api.services';
import { GameDataRow, Pagination } from '../types';

interface GamesDataFilters {
  orderBy: string | null;
  desc: boolean;
  gameName: string;
  playtime: string | null;
  percentMin?: string;
  percentMax?: string;
  selectedCompletionFilterValue: string | null;
}

export function useGamesData (filters: GamesDataFilters) {
  const { orderBy, desc, gameName, playtime, selectedCompletionFilterValue } = filters;
  const [games, setGames] = useState<GameDataRow[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadGames = useCallback(async (reset = false) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      orderBy: orderBy || 'lastLaunchTime',
      desc: desc ? '1' : '0',
      language: i18n.language,
      page: page.toString(),
      pageSize: '30'
    });

    if (selectedCompletionFilterValue) {
      if (selectedCompletionFilterValue === 'Completed') {
        queryParams.append('percentMin', '99');
      } else {
        const [min, max] = selectedCompletionFilterValue.slice(7).split('-');
        queryParams.append('percentMin', min);
        queryParams.append('percentMax', max);
      }
    }

    if (gameName) {
      queryParams.append('gameName', gameName);
    }

    if (playtime) {
      queryParams.append('playtime', playtime);
    }

    const dataSteamId = localStorage.getItem('steamId');
    const achData = await ApiService.get<Pagination<GameDataRow>>(
      `user/${dataSteamId}/games?${queryParams.toString()}`
    );

    setHasMore(achData.rows.length > 0);
    setGames((prev) => (reset ? achData.rows : [...prev, ...achData.rows]));
    setIsLoading(false);
  }, [orderBy, desc, gameName, playtime, selectedCompletionFilterValue, page]);

  useEffect(() => {
    setGames([]);
    setPage(1);
    loadGames(true);
  }, [orderBy, desc, gameName, playtime, selectedCompletionFilterValue]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadGames();
    }
  }, [page]);

  return { games, isLoading, hasMore, loadMore, setPage };
}

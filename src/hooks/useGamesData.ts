import { useState, useEffect, useCallback, useRef } from 'react';
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

interface UseGamesDataOptions {
  initialPage?: number;
}

export function useGamesData (filters: GamesDataFilters, options?: UseGamesDataOptions) {
  const { orderBy, desc, gameName, playtime, selectedCompletionFilterValue } = filters;
  const initialPageRef = useRef(Math.max(options?.initialPage ?? 1, 1));
  const hasInitializedRef = useRef(false);
  const skipNextPageLoadRef = useRef(false);
  const [games, setGames] = useState<GameDataRow[]>([]);
  const [page, setPage] = useState(initialPageRef.current);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchGamesPage = useCallback(async (pageToLoad: number) => {
    const queryParams = new URLSearchParams({
      orderBy: orderBy || 'lastLaunchTime',
      desc: desc ? '1' : '0',
      language: i18n.language,
      page: pageToLoad.toString(),
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
    return await ApiService.get<Pagination<GameDataRow>>(
      `user/${dataSteamId}/games?${queryParams.toString()}`
    );
  }, [orderBy, desc, gameName, playtime, selectedCompletionFilterValue]);

  const loadGames = useCallback(async (reset = false, targetPage = page) => {
    setIsLoading(true);

    if (reset) {
      const pagesToLoad = Array.from({ length: targetPage }, (_, index) => index + 1);
      const loadedPages = await Promise.all(
        pagesToLoad.map(async (pageNumber) => await fetchGamesPage(pageNumber))
      );
      const rows = loadedPages.flatMap((loadedPage) => loadedPage.rows);
      const lastPage = loadedPages.at(-1);

      setHasMore((lastPage?.rows.length ?? 0) > 0);
      setGames(rows);
      setIsLoading(false);
      return;
    }

    const achData = await fetchGamesPage(targetPage);

    setHasMore(achData.rows.length > 0);
    setGames((prev) => [...prev, ...achData.rows]);
    setIsLoading(false);
  }, [fetchGamesPage, page]);

  useEffect(() => {
    const nextPage = hasInitializedRef.current ? 1 : initialPageRef.current;

    hasInitializedRef.current = true;
    initialPageRef.current = 1;
    skipNextPageLoadRef.current = nextPage > 1;
    setGames([]);
    setHasMore(true);
    setPage(nextPage);
    loadGames(true, nextPage);
  }, [orderBy, desc, gameName, playtime, selectedCompletionFilterValue]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      if (skipNextPageLoadRef.current) {
        skipNextPageLoadRef.current = false;
        return;
      }

      loadGames(false, page);
    }
  }, [page, loadGames]);

  return { games, isLoading, hasMore, loadMore, page, setPage };
}

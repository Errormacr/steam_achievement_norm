import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';

import ScrollToTopButton from '../components/ScrollToTopButton';
import AddGame from '../features/AddGame';
import { useGamesData } from '../hooks/useGamesData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { GameFilterBar } from '../features/GameFilterBar';
import { GameList } from '../components/GameList';

import '../styles/scss/Games.scss';
import '../styles/scss/FilterSort.scss';
import { Filters } from '../types';

const GAMES_PAGE_STATE_KEY = 'gamesPageState';

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  selectedValue: 'lastLaunchTime',
  selectedTimeFilterValue: null,
  selectedCompletionFilterValue: null,
  desc: true
};

interface GamesPageState {
  filters: Filters;
  page: number;
  scrollY: number;
}

function readSavedState (): GamesPageState | null {
  const savedState = sessionStorage.getItem(GAMES_PAGE_STATE_KEY);

  if (!savedState) {
    return null;
  }

  try {
    return JSON.parse(savedState) as GamesPageState;
  } catch {
    sessionStorage.removeItem(GAMES_PAGE_STATE_KEY);
    return null;
  }
}

function saveState (state: GamesPageState) {
  sessionStorage.setItem(GAMES_PAGE_STATE_KEY, JSON.stringify(state));
}

export default function Games () {
  const navigate = useNavigate();
  const savedState = useMemo(() => readSavedState(), []);
  const restoreScrollRef = useRef(savedState?.scrollY ?? 0);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(
    Boolean(savedState && savedState.scrollY > 0)
  );

  const [filters, setFilters] = useState<Filters>(savedState?.filters ?? DEFAULT_FILTERS);

  const { games, isLoading, hasMore, loadMore, page, setPage } = useGamesData({
    orderBy: filters.selectedValue,
    desc: filters.desc,
    gameName: filters.searchQuery,
    playtime: filters.selectedTimeFilterValue,
    selectedCompletionFilterValue: filters.selectedCompletionFilterValue
  }, { initialPage: savedState?.page });

  const handleFilterChange = (newFilters: Filters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const infiniteScrollRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  useEffect(() => {
    saveState({
      filters,
      page,
      scrollY: window.scrollY
    });
  }, [filters, page]);

  useEffect(() => {
    const handleScroll = () => {
      saveState({
        filters,
        page,
        scrollY: window.scrollY
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filters, page]);

  useEffect(() => {
    if (!shouldRestoreScroll || isLoading || games.length === 0) {
      return;
    }

    const savedScrollY = restoreScrollRef.current;

    const restoreScroll = () => {
      window.scrollTo(0, savedScrollY);

      window.setTimeout(() => {
        window.scrollTo(0, savedScrollY);
        setShouldRestoreScroll(false);
      }, 150);
    };

    const animationFrameId = window.requestAnimationFrame(restoreScroll);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [games.length, isLoading, shouldRestoreScroll]);

  function rendApp () {
    navigate('/');
  }

  return (
    <I18nextProvider i18n={i18n}>
      <GameFilterBar filters={filters} onFilterChange={handleFilterChange} />

      <FaArrowLeft className="button-icon return" onClick={rendApp} id="return" />

      <AddGame />

      <div id="header key">
        <ScrollToTopButton />

        <br />
        <GameList games={games} isLoading={isLoading} lastElementRef={infiniteScrollRef} />
        <ScrollToTopButton />
        <AddGame />
      </div>
    </I18nextProvider>
  );
}

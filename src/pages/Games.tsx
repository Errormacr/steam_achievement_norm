import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Container, IconButton, Typography } from '@mui/material';

import AddGame from '../features/AddGame';
import { useGamesData } from '../hooks/useGamesData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { GameFilterBar } from '../features/GameFilterBar';
import { GameList } from '../components/GameList';

import '../styles/scss/Games.scss';
import '../styles/scss/FilterSort.scss';
import '../styles/scss/PageShell.scss';
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
  const { t } = useTranslation();
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
      globalThis.scrollTo(0, savedScrollY);

      globalThis.setTimeout(() => {
        window.scrollTo(0, savedScrollY);
        setShouldRestoreScroll(false);
      }, 150);
    };

    const animationFrameId = globalThis.requestAnimationFrame(restoreScroll);

    return () => {
      globalThis.cancelAnimationFrame(animationFrameId);
    };
  }, [games.length, isLoading, shouldRestoreScroll]);

  function handleGoBack () {
    navigate('/');
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Container maxWidth={false} className="page-shell games-page">
        <Box className="page-shell__header games-page__header">
          <IconButton className="page-shell__back" onClick={handleGoBack} id="return">
            <FaArrowLeft />
          </IconButton>
          <Typography variant="h4" component="h1" className="page-shell__title games-page__title">
            {t('Games')}
          </Typography>
          <Box className="page-shell__actions games-page__actions">
            <AddGame />
          </Box>
        </Box>

        <div className="games-page__filters">
          <GameFilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <GameList games={games} isLoading={isLoading} lastElementRef={infiniteScrollRef} />
      </Container>
    </I18nextProvider>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';

import ScrollToTopButton from '../components/ScrollToTopButton';
import AddGame from '../features/AddGame';
import { useGamesData } from '../../hooks/useGamesData';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { GameFilterBar } from '../features/GameFilterBar';
import { GameList } from '../components/GameList';

import '../scss/Games.scss';
import '../scss/FilterSort.scss';

export default function Games () {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedValue: 'lastLaunchTime',
    selectedTimeFilterValue: null,
    selectedCompletionFilterValue: null,
    desc: true
  });

  const { games, isLoading, hasMore, loadMore, setPage } = useGamesData({
    orderBy: filters.selectedValue,
    desc: filters.desc,
    gameName: filters.searchQuery,
    playtime: filters.selectedTimeFilterValue,
    selectedCompletionFilterValue: filters.selectedCompletionFilterValue
  });

  const handleFilterChange = (newFilters: any) => {
    setPage(1);
    setFilters(newFilters);
  };

  const infiniteScrollRef = useInfiniteScroll(loadMore, hasMore, isLoading);

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

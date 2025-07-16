import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';

import GameCard from '../components/GameCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import IdKeyInput from '../components/IdKeyInput';
import AddGame from '../features/AddGame';
import { ApiService } from '../../services/api.services';
import { GameDataRow, Pagination } from '../../interfaces';

import '../scss/Games.scss';
import '../scss/FilterSort.scss';

export default function Games () {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [games, setGames] = useState<GameDataRow[]>([]);
  const [desc, setDesc] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>('lastLaunchTime');
  const [isTimeFilterDropdownOpen, setTimeFilterDropdownOpen] = useState(false);
  const [isCompletedFilterDropdownOpen, setCompletedFilterDropdownOpen] = useState(false);
  const [selectedTimeFilterValue, setSelectedTimeFilterValue] = useState<string | null>(null);
  const [selectedCompletionFilterValue, setSelectedCompletionFilterValue] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const listRef = useRef(null);
  const filterTimeListRef = useRef(null);
  const filterCompletedListRef = useRef(null);
  const observer = useRef<IntersectionObserver | null>(null);

  function rendApp () {
    navigate('/');
  }

  const handleItemClick = (value: string) => {
    setSelectedValue(value);
    setDropdownOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTimeFilterItemClick = (value: string) => {
    if (selectedTimeFilterValue === value) {
      setSelectedTimeFilterValue(null);
    } else {
      setSelectedTimeFilterValue(value);
    }
    setTimeFilterDropdownOpen(false);
  };

  const handleCompletionFilterItemClick = (value: string) => {
    if (selectedCompletionFilterValue === value) {
      setSelectedCompletionFilterValue(null);
    } else {
      setSelectedCompletionFilterValue(value);
    }
    setCompletedFilterDropdownOpen(false);
  };

  const handleToggleArrows = () => {
    setDesc(!desc);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      listRef.current &&
      !listRef.current.contains(event.target as Node) &&
      isDropdownOpen
    ) {
      setDropdownOpen(false);
    }
  };

  const handleFilterOutsideClick = (event: MouseEvent) => {
    if (
      filterCompletedListRef.current &&
      !filterCompletedListRef.current.contains(event.target as Node) &&
      isCompletedFilterDropdownOpen
    ) {
      setCompletedFilterDropdownOpen(false);
    }
    if (
      filterTimeListRef.current &&
      !filterTimeListRef.current.contains(event.target as Node) &&
      isTimeFilterDropdownOpen
    ) {
      setTimeFilterDropdownOpen(false);
    }
  };

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('click', handleFilterOutsideClick);

  const updateGames = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      orderBy: selectedValue,
      desc: desc ? '1' : '0',
      language: i18n.language,
      page: page.toString(),
      pageSize: '30'
    });

    if (selectedCompletionFilterValue) {
      if (selectedTimeFilterValue === 'Completed') {
        queryParams.append('percentMin', '99');
      } else {
        const [min, max] = selectedCompletionFilterValue.slice(7).split('-');
        queryParams.append('percentMin', min);
        queryParams.append('percentMax', max);
      }
    }

    if (searchQuery) {
      queryParams.append('gameName', searchQuery);
    }

    if (selectedTimeFilterValue) {
      queryParams.append('playtime', selectedTimeFilterValue);
    }

    const dataSteamId = localStorage.getItem('steamId');
    const achData = await ApiService.get<Pagination<GameDataRow>>(
      `user/${dataSteamId}/games?${queryParams.toString()}`
    );

    setHasMore(achData.rows.length > 0);
    setGames((prev) => [...prev, ...achData.rows]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (page === prevPage) {
      setGames([]);
      setPage(1);
      setPrevPage(1);
    } else {
      setPrevPage(page);
    }
    updateGames();
  }, [
    selectedTimeFilterValue,
    searchQuery,
    selectedCompletionFilterValue,
    selectedValue,
    desc,
    page
  ]);

  const lastGameObserver = useCallback(
    (node: Element) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(
    useCallback(() => {
      try {
        return () => {
          document.removeEventListener('click', handleOutsideClick);
          document.removeEventListener('click', handleFilterOutsideClick);
        };
      } catch (error) {
        window.alert(error.message);
      }
    }, []),
    []
  );

  const sortingOptions = [
    {
      value: 'lastLaunchTime',
      label: 'LastLaunchSort'
    },
    {
      value: 'percent',
      label: 'PercentAchSort'
    },
    {
      value: 'allAchCount',
      label: 'AllAChInGameSort'
    },
    {
      value: 'unlockedCount',
      label: 'GainedAchSort'
    },
    {
      value: 'notUnlockedCount',
      label: 'NonGainedAchSort'
    },
    {
      value: 'playtime',
      label: 'PlayTimeSort'
    }
  ];

  return (
    <I18nextProvider i18n={i18n}>
      <div className="gameFilterCont">
        <div className="inputSortFilterContainerGames">
          <IdKeyInput
            placeholder={t('SearchGames')}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <div ref={listRef} className="dropdown-container">
            <button
              className="dropdown-button"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              {t('SortBy')}
            </button>

            {isDropdownOpen && (
              <ul className="dropdown-list">
                {sortingOptions.map((option) => (
                  <li
                    key={option.value}
                    className={selectedValue === option.value ? 'active' : ''}
                    onClick={() => handleItemClick(option.value)}
                  >
                    {t(option.label)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div ref={filterTimeListRef} className="dropdown-container">
            {selectedTimeFilterValue != null && (
              <div
                onClick={() => setSelectedTimeFilterValue(null)}
                className="cross"
              >
                <div className="horizontal"></div>
              </div>
            )}
            <button
              className="dropdown-button"
              onClick={() => setTimeFilterDropdownOpen(!isTimeFilterDropdownOpen)}
            >
              {t('TimeFilter')}
            </button>
            {isTimeFilterDropdownOpen && (
              <ul className="dropdown-list">
                {[
                  { value: '1000', label: 'Above1000hour' },
                  { value: '500', label: 'Above500hour' },
                  { value: '100', label: 'Above100hour' },
                  { value: '50', label: 'Above50hour' },
                  { value: '20', label: 'Above20hour' },
                  { value: '2', label: 'Above2hour' }
                ].map((filter) => (
                  <li
                    key={filter.value}
                    className={selectedTimeFilterValue === filter.value ? 'active' : ''}
                    onClick={() => handleTimeFilterItemClick(filter.value)}
                  >
                    {t(filter.label)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div ref={filterCompletedListRef} className="dropdown-container">
            {selectedCompletionFilterValue != null && (
              <div
                onClick={() => setSelectedCompletionFilterValue(null)}
                className="cross"
              >
                <div className="horizontal"></div>
                <div className="vertical"></div>
              </div>
            )}
            <button
              className="dropdown-button"
              onClick={() => setCompletedFilterDropdownOpen(!isCompletedFilterDropdownOpen)}
            >
              {t('CompletedFilter')}
            </button>
            {isCompletedFilterDropdownOpen && (
              <ul className="dropdown-list">
                {[
                  'percent99-100',
                  'percent90-100',
                  'percent80-90',
                  'percent70-80',
                  'percent60-70',
                  'percent50-60',
                  'percent40-50',
                  'percent30-40',
                  'percent20-30',
                  'percent10-20',
                  'percent0-10'
                ].map((filterValue) => (
                  <li
                    key={filterValue}
                    className={selectedCompletionFilterValue === filterValue ? 'active' : ''}
                    onClick={() => handleCompletionFilterItemClick(filterValue)}
                  >
                    {t(filterValue)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="arrows-container" onClick={handleToggleArrows}>
            <div className={desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
            <div className={!desc ? 'arrow activate' : 'arrow'}>&#x25BC;</div>
          </div>
        </div>
      </div>

      <FaArrowLeft
                className="button-icon return"
                onClick={rendApp}
                id="return"/>

      <AddGame />

      <div id="header key">
        <ScrollToTopButton />

        <br />
        <div className="games-container">
          {games.map((game, index) => (
            <div
              key={game.appid}
              ref={index === games.length - 1 ? lastGameObserver : null}
              style={{width:'fit-content'}}
            >
              <GameCard appid={game.appid} backWindow={'Games'} />
            </div>
          ))}
          {isLoading && <div className="loading">Loading...</div>}
        </div>
        <ScrollToTopButton />
        <AddGame />
      </div>
    </I18nextProvider>
  );
}

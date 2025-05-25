import React, { useEffect, useRef, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import '../scss/AchConteiner.scss';
import '../scss/FilterSort.scss';
import IdKeyInput from '../components/IdKeyInput';
import { Pagination, AchievmentsFromView, AchBoxProps } from '../../interfaces';
import { ApiService } from '../../services/api.services';
import AchievementImage from '../components/AchievementImage';

const AchBox : React.FC < AchBoxProps > = ({ appid, all, minPercent, maxPercent, date, unlocked }) => {
  const [ach,
    setAch] = useState < AchievmentsFromView[] >([]);

  const [isDropdownOpen,
    setDropdownOpen] = useState(false);
  const [selectedValue,
    setSelectedValue] = useState < string | null >('unlockedDate');
  const [desc,
    setDesc] = useState(true);
  const [isArrowUpOpen,
    setIsArrowUpOpen] = useState(false);
  const [isArrowDownOpen,
    setIsArrowDownOpen] = useState(true);
  const listRef = useRef(null);
  const filterTimeListRef = useRef(null);
  const filterCompletedListRef = useRef(null);
  const [isTimeFilterDropdownOpen,
    setIsTimeFilterDropdownOpen] = useState(false);
  const [isCompletedFilterDropdownOpen,
    setIsCompletedFilterDropdownOpen] = useState(false);
  const [selectedCompletionFilterValue,
    setSelectedCompletionFilterValue] = useState < string | null >(null);
  const [searchQueryGameName,
    setSearchQueryGameName] = useState('');
  const handleSearchInputChange = (e : React.ChangeEvent < HTMLInputElement >) => {
    setSearchQueryGameName(e.target.value);
  };
  const intervalRef = useRef < number | null >(null);
  const [isLoading,
    setIsLoading] = useState(false);
  const [page,
    setPage] = useState(1);
  const [hasMore,
    setHasMore] = useState(true);
  const observer = useRef < IntersectionObserver | null >(null);

  const [searchQueryAch,
    setSearchQueryAch] = useState('');
  const handleAchSearchInputChange = (e : React.ChangeEvent < HTMLInputElement >) => {
    setSearchQueryAch(e.target.value);
  };
  const handleItemClick = (value : string) => {
    setSelectedValue(value);
    setDropdownOpen(false);
  };
  const { t } = useTranslation();
  const updateAchievements = async (reset = false, page = 1) => {
    setIsLoading(true);
    if (reset) {
      setAch([]);
    }
    const queryParams = new URLSearchParams({
      orderBy: selectedValue,
      desc: desc
        ? '1'
        : '0',
      language: i18n.language,
      page: hasMore
        ? page.toString()
        : (page - 1).toString(),
      pageSize: '250'

    });

    if (minPercent) {
      queryParams.set('percentMin', minPercent.toString());
    }

    if (maxPercent) {
      queryParams.set('percentMax', maxPercent.toString());
    }

    if (date) {
      queryParams.set('unlockedDate', date);
    }

    if (selectedCompletionFilterValue) {
      const [min,
        max] = selectedCompletionFilterValue
        .slice(7)
        .split('-');
      queryParams.set('percentMin', min);
      queryParams.set('percentMax', max);
    }
    if (!all) {
      queryParams.append('appid', '' + appid);
      if (unlocked) { queryParams.append('unlocked', '1'); }
    } else {
      queryParams.append('unlocked', '1');
    }
    if (searchQueryAch) {
      queryParams.append('displayName', searchQueryAch);
    }
    if (searchQueryGameName) {
      queryParams.append('gameName', searchQueryGameName);
    }
    const dataSteamId = localStorage.getItem('steamId');
    const achData = await ApiService.get < Pagination < AchievmentsFromView >>(`user/${dataSteamId}/achievements?${queryParams.toString()}`);
    if (reset) {
      setAch(achData.rows);
    } else {
      setAch((prev) => [
        ...prev,
        ...achData.rows
      ]);
    }
    setHasMore(achData.rows.length > 0);
    setIsLoading(false);
  };
  useEffect(() => {
    setPage(1);
    if (intervalRef.current) {
      window.clearTimeout(intervalRef.current);
    }

    intervalRef.current = window.setTimeout(() => {
      // noinspection JSIgnoredPromiseFromCall
      updateAchievements(true, 1);
    }, 500);
    return () => {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
      }
    };
  }, [desc, selectedCompletionFilterValue, selectedValue, searchQueryAch, searchQueryGameName]);

  useEffect(() => {
    if (page > 1) {
      updateAchievements(false, page);
    }
  },
  [page]);
  const handleCompletionFilterItemClick = (value : string) => {
    if (selectedCompletionFilterValue === value) {
      setSelectedCompletionFilterValue(null);
    } else {
      setSelectedCompletionFilterValue(value);
    }
    setIsCompletedFilterDropdownOpen(false);
  };

  const handleToggleArrows = () => {
    setDesc(!desc);
    setIsArrowUpOpen(!isArrowUpOpen);
    setIsArrowDownOpen(!isArrowDownOpen);
  };

  const handleOutsideClick = (event : MouseEvent) => {
    if (listRef.current && !listRef.current.contains(event.target as Node) && isDropdownOpen) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('click', handleOutsideClick);
  const handleFilterOutsideClick = (event : MouseEvent) => {
    if (filterCompletedListRef.current && !filterCompletedListRef.current.contains(event.target as Node) && isCompletedFilterDropdownOpen) {
      setIsCompletedFilterDropdownOpen(false);
    }
    if (filterTimeListRef.current && !filterTimeListRef.current.contains(event.target as Node) && isTimeFilterDropdownOpen) {
      setIsTimeFilterDropdownOpen(false);
    }
  };

  document.addEventListener('click', handleFilterOutsideClick);

  const sortingOptions = [
    {
      value: 'displayName',
      label: 'Name'
    }, {
      value: 'description',
      label: 'Description'
    }, {
      value: 'percent',
      label: 'PercentPlayer'
    }, {
      value: 'unlockedDate',
      label: 'DataGain'
    }
  ];

  if (!all) {
    sortingOptions.push({ value: 'unlocked', label: 'Gained' });
  }

  const lastAchievementRef = (node : HTMLDivElement) => {
    if (isLoading) {
      return;
    }
    if (observer.current) {
      observer
        .current
        .disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) {
      observer
        .current
        .observe(node);
    }
  };

  return (
        <I18nextProvider i18n={i18n}>
            <div className="AchSet">
                <div className="details-container">
                    <div className="inputSortFilterContainerAch">
                        {all && (<IdKeyInput
                            placeholder={t('SearchGames')}
                            value={searchQueryGameName}
                            onChange={handleSearchInputChange}/>)}
                        <IdKeyInput
                            placeholder={t('SearchAch')}
                            value={searchQueryAch}
                            onChange={handleAchSearchInputChange}/>
                        <div ref={listRef} className="dropdown-container">
                            <button
                                className="dropdown-button"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}>
                                {t('SortBy')}
                            </button>

                            {isDropdownOpen && (
                                <ul className="dropdown-list">
                                    {sortingOptions.map((option) => (
                                        <li
                                            key={option.value}
                                            className={(selectedValue === option.value)
                                              ? 'active'
                                              : ''}
                                            onClick={() => {
                                              handleItemClick(option.value);
                                            }}>
                                            {t(option.label)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div ref={filterCompletedListRef} className="dropdown-container">
                            {selectedCompletionFilterValue != null && (
                                <div role='button'
                                    onClick={() => {
                                      setSelectedCompletionFilterValue(null);
                                    }}
                                    className="cross">
                                    <div className="horizontal"></div>
                                    <div className="vertical"></div>
                                </div>
                            )}
                            <button
                                className="dropdown-button"
                                onClick={() => setIsCompletedFilterDropdownOpen(!isCompletedFilterDropdownOpen)}>
                                {t('GainedPercent')}
                            </button>

                            {isCompletedFilterDropdownOpen && (
                                <ul className="dropdown-list">
                                    {[
                                      'percent90-100',
                                      'percent80-90',
                                      'percent70-80',
                                      'percent60-70',
                                      'percent50-60',
                                      'percent40-50',
                                      'percent30-40',
                                      'percent20-30',
                                      'percent10-20',
                                      'percent5-10',
                                      'percent0-5'
                                    ].filter((filterValue) => {
                                      const [min,
                                        max] = filterValue
                                        .slice(7)
                                        .split('-');
                                      return minPercent <= Number(min) && maxPercent >= Number(max);
                                    }).map((filterValue) => (
                                        <li
                                            key={filterValue}
                                            className={selectedCompletionFilterValue === filterValue
                                              ? 'active'
                                              : ''}
                                            onClick={() => handleCompletionFilterItemClick(filterValue)}>
                                            {t(filterValue)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button className="arrows-container" onClick={() => handleToggleArrows()}>
                            <div
                                className={isArrowUpOpen
                                  ? 'arrow activate'
                                  : 'arrow'}>
                                &#x25B2;
                            </div>
                            <div
                                className={isArrowDownOpen
                                  ? 'arrow activate'
                                  : 'arrow'}>
                                &#x25BC;
                            </div>
                        </button>
                    </div>
                </div>
                <div className="AchCont">

                    {ach.map((achievement, index, arr) => {
                      let last = false;
                      if (index === arr.length - 1) {
                        last = true;
                      }

                      return <AchievementImage
                         key={achievement.name}
            name={achievement.name}
            icon={achievement.unlocked ? achievement.icon : achievement.grayIcon}
            displayName={achievement.displayName}
            description={achievement.description}
            percent={achievement.percent}
            unlockedDate={achievement.unlockedDate}
            gameName={achievement.game?.gamename}
                           />;
                    })}
                </div>
            </div>
        </I18nextProvider>
  );
};
export default AchBox;

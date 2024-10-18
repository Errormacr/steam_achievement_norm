import React, { useCallback, useEffect, useRef, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import './scss/AchConteiner.scss';
import './scss/FilterSort.scss';
import IdKeyInput from './IdKeyInput';
interface AchBoxProps {
  appid?: number;
  all: boolean;
}
const AchBox : React.FC < AchBoxProps > = ({
  appid
  , all
}) => {
  const [ach, setAch] = useState([]);

  const [isDropdownOpen,
    setDropdownOpen] = useState(false);
  const [selectedValue,
    setSelectedValue] = useState < string | null >('data');
  const [isArrowUpOpen,
    setIsArrowUpOpen] = useState(false);
  const [isArrowDownOpen,
    setIsArrowDownOpen] = useState(true);
  const listRef = useRef(null);
  const filterTimeListRef = useRef(null);
  const filterCompletedListRef = useRef(null);
  const [isTimeFilterDropdownOpen,
    setTimeFilterDropdownOpen] = useState(false);
  const [isCompletedFilterDropdownOpen,
    setCompletedFilterDropdownOpen] = useState(false);
  const [selectedTimeFilterValue,
    setSelectedTimeFilterValue] = useState < string | null >(null);
  const [selectedCompletionFilterValue,
    setSelectedCompletionFilterValue] = useState < string | null >(null);
  const [searchQueryGameName,
    setSearchQueryGameName] = useState('');
  const handleSearchInputChange = (e : React.ChangeEvent < HTMLInputElement >) => {
    setSearchQueryGameName(e.target.value);
  };

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
  const updateAchievements = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const achResponse = await fetch(`http://localhost:8888/api/user/${dataSteamId}/achievements?orderBy=unlocked&desc=1&page=1&pageSize=10&percentMin=0&percentMax=100&language=${i18n.language}&gameName=port${appid ? `&appid=${appid}` : ''}&displayName=%D1%8B&unlocked=1`);
  }, []);
  useEffect(useCallback(() => {
    try {
    } catch (error) {
      window.alert(error.message);
    }
  }, []), []);
  const handleCompletionFilterItemClick = (value : string) => {
    if (selectedCompletionFilterValue === value) {
      setSelectedCompletionFilterValue(null);
    } else {
      setSelectedCompletionFilterValue(value);
    }
    setCompletedFilterDropdownOpen(false);
  };

  const handleToggleArrows = () => {
    if (isArrowDownOpen) {
      setSelectedValue(selectedValue + 'rev');
      setIsArrowUpOpen(true);
      setIsArrowDownOpen(false);
    } else {
      setSelectedValue(selectedValue.slice(0, -3));
      setIsArrowUpOpen(false);
      setIsArrowDownOpen(true);
    }
  };

  const handleOutsideClick = (event : MouseEvent) => {
    if (listRef.current && !listRef.current.contains(event.target as Node) && isDropdownOpen) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('click', handleOutsideClick);
  const handleFilterOutsideClick = (event : MouseEvent) => {
    if (filterCompletedListRef.current && !filterCompletedListRef.current.contains(event.target as Node) && isCompletedFilterDropdownOpen) {
      setCompletedFilterDropdownOpen(false);
    }
    if (filterTimeListRef.current && !filterTimeListRef.current.contains(event.target as Node) && isTimeFilterDropdownOpen) {
      setTimeFilterDropdownOpen(false);
    }
  };

  document.addEventListener('click', handleFilterOutsideClick);

  const sortingOptions = [
    {
      value: 'name',
      label: 'Name',
      reverseValue: 'namerev'
    }, {
      value: 'desc',
      label: 'Description',
      reverseValue: 'descrev'
    }, {
      value: 'proc',
      label: 'PercentPlayer',
      reverseValue: 'procrev'
    }, {
      value: 'data',
      label: 'DataGain',
      reverseValue: 'datarev'
    }
  ];

  if (!all) {
    sortingOptions.push({ value: 'unlocked', label: 'Gained', reverseValue: 'unlockedrev' });
  }
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
                                            className={(selectedValue === option.value || selectedValue === option.reverseValue)
                                              ? 'active'
                                              : ''}
                                            onClick={() => {
                                              if (isArrowDownOpen) {
                                                handleItemClick(option.value);
                                              } else {
                                                handleItemClick(option.reverseValue);
                                              }
                                            }}>
                                            {t(option.label)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div ref={filterTimeListRef} className="dropdown-container">
                            {selectedTimeFilterValue != null && (
                                <div
                                    onClick={() => {
                                      setSelectedTimeFilterValue(null);
                                    }}
                                    className="cross">
                                    <div className="horizontal"></div>
                                    <div className="vertical"></div>
                                </div>
                            )}

                        </div>
                        <div ref={filterCompletedListRef} className="dropdown-container">
                            {selectedCompletionFilterValue != null && (
                                <div
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
                                onClick={() => setCompletedFilterDropdownOpen(!isCompletedFilterDropdownOpen)}>
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
                                    ].map((filterValue) => (
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
                        <div className="arrows-container" onClick={() => handleToggleArrows()}>
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
                        </div>
                    </div>
                </div>
                <div className="AchCont">

                    {filteredAch.map((ach) => (<img
                        className={ach.achivment.percent <= 5
                          ? 'rare1'
                          : ach.achivment.percent <= 20
                            ? 'rare2'
                            : ach.achivment.percent <= 45
                              ? 'rare3'
                              : ach.achivment.percent <= 60
                                ? 'rare4'
                                : 'rare5'}
                        key={(all
                          ? ach.gameName
                          : '') + ach.achivment.displayName + ach.achivment.percent + ach.achivment.name}
                        src={ ach.achivment.icon
                          }
                        alt={ach.achivment.displayName}
                        title={`${all
                        ? ach.gameName + '\n'
                        : ''}${ach.achivment
                            .displayName}\n${ach.achivment
                            .description}\n${ach.achivment
                            .percent
                            .toFixed(2)}\n${new Date(ach.achivment.unlockedTimestamp * 1000)}`}/>))}
                </div>
            </div>
        </I18nextProvider>
  );
};
export default AchBox;

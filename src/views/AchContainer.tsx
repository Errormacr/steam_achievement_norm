import React, { useEffect, useRef, useState } from 'react';
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
    setSelectedValue] = useState < string | null >('unlockedDate');
  const [desc, setDesc] = useState(true);
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
  const updateAchievements = async () => {
    const queryParams = new URLSearchParams({
      orderBy: selectedValue,
      desc: desc ? '1' : '0',
      language: i18n.language
    });
    if (selectedCompletionFilterValue) {
      const [min, max] = selectedCompletionFilterValue.slice(7).split('-');
      queryParams.append('percentMin', min);
      queryParams.append('percentMax', max);
    }
    if (!all) {
      queryParams.append('appid', '' + appid);
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
    const achResponse = await fetch(`http://localhost:8888/api/user/${dataSteamId}/achievements?${queryParams.toString()}`);
    const achData = await achResponse.json();
    setAch(achData.rows);
  };
  useEffect(() => {
    try {
      updateAchievements();
    } catch (error) {
      window.alert(error.message);
    }
  }, [desc, selectedCompletionFilterValue, selectedValue, searchQueryAch, searchQueryGameName]);
  const handleCompletionFilterItemClick = (value : string) => {
    if (selectedCompletionFilterValue === value) {
      setSelectedCompletionFilterValue(null);
    } else {
      setSelectedCompletionFilterValue(value);
    }
    setCompletedFilterDropdownOpen(false);
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
      setCompletedFilterDropdownOpen(false);
    }
    if (filterTimeListRef.current && !filterTimeListRef.current.contains(event.target as Node) && isTimeFilterDropdownOpen) {
      setTimeFilterDropdownOpen(false);
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

                    {ach.map((achievement) => (<img
                        className={achievement.percent <= 5
                          ? 'rare1'
                          : achievement.percent <= 20
                            ? 'rare2'
                            : achievement.percent <= 45
                              ? 'rare3'
                              : achievement.percent <= 60
                                ? 'rare4'
                                : 'rare5'}
                        key={(all
                          ? achievement.game.gamename
                          : '') + achievement.displayName + achievement.percent + achievement.name}
                        src={ achievement.unlocked ? achievement.icon : achievement.grayIcon
                          }
                        alt={achievement.displayName}
                        title={`${all
                        ? achievement.game.gamename + '\n'
                        : ''}${achievement
                            .displayName}\n${achievement
                            .description}\n${achievement
                            .percent
                            .toFixed(2)}\n${achievement.unlockedDate ?? ''}`}/>))}
                </div>
            </div>
        </I18nextProvider>
  );
};
export default AchBox;

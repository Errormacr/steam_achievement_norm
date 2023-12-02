import {useCallback, useEffect, useRef, useState} from "react";
import {UnixTimestampToDate} from "./GameCard";
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import "./scss/AchConteiner.scss";
import './scss/FilterSort.scss';
import IdKeyInput from "./IdKeyInput";
export default function AchBox(data : any) {
    const [isDropdownOpen,
        setDropdownOpen] = useState(false);
    const [selectedValue,
        setSelectedValue] = useState < string | null > ('data');
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
        setSelectedTimeFilterValue] = useState < string | null > (null);
    const [selectedCompletionFilterValue,
        setSelectedCompletionFilterValue] = useState < string | null > (null);
    const [game,
        setGame] = useState([]);
    const [allAChPage,
        setAllAchPage] = useState(Boolean);
    const [allAch,
        setAllAch] = useState([]);
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
    const {t} = useTranslation();
    const filteredAch =data['data'][1] ? 
    allAch.filter((game) => {
        let nameMatch = true
        if (data['data'][1]) {
            const gameName = game
                .gameName
                .toLowerCase();

            // Фильтрация по имени игры

            nameMatch = gameName
                .toLowerCase()
                .includes(searchQueryGameName.toLowerCase());
        }
        const nameAchMatch = game['achivment']
            .displayName
            .toLowerCase()
            .includes(searchQueryAch.toLowerCase())
        // Фильтрация по времени
        let completionMatch;
        if (selectedCompletionFilterValue == null) {
            completionMatch = true;
        } else if (selectedCompletionFilterValue.startsWith("percent")) {
            const rangeBounds = selectedCompletionFilterValue
                .replace("percent", "")
                .split("-")
                .map(Number);

            completionMatch = rangeBounds[0] < game['achivment'].percent && game['achivment'].percent < rangeBounds[1];
        } else {
            completionMatch = true;
        }
        // Фильтрация по завершению Возвращаем true, только если все условия выполняются
        return nameMatch && completionMatch && nameAchMatch;
    }).sort((a : any, b : any) => {
        a = a['achivment'];
        b = b['achivment'];
        switch (selectedValue) {
            case "namerev":
                return a
                    .displayName
                    .localeCompare(b.displayName);
            case "name":
                return b
                    .displayName
                    .localeCompare(a.displayName);
            case "descrev":
                return a
                    .description
                    .localeCompare(b.description);
            case "desc":
                return b
                    .description
                    .localeCompare(a.description);
            case "procrev":
                return a.percent - b.percent;
            case "proc":
                return b.percent - a.percent;
            case "datarev":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return a.unlocktime - b.unlocktime;
            case "data":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return b.unlocktime - a.unlocktime;
            case "unlockedrev":
                return a.achieved - b.achieved;
            case "unlocked":
                return b.achieved - a.achieved;
            default:
                return 0;
        }
    })
    : allAch.sort((a : any, b : any) => {
        a = a['achivment'];
        b = b['achivment'];
        switch (selectedValue) {
            case "namerev":
                return a
                    .displayName
                    .localeCompare(b.displayName);
            case "name":
                return b
                    .displayName
                    .localeCompare(a.displayName);
            case "descrev":
                return a
                    .description
                    .localeCompare(b.description);
            case "desc":
                return b
                    .description
                    .localeCompare(a.description);
            case "procrev":
                return a.percent - b.percent;
            case "proc":
                return b.percent - a.percent;
            case "datarev":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return a.unlocktime - b.unlocktime;
            case "data":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return b.unlocktime - a.unlocktime;
            case "unlockedrev":
                return a.achieved - b.achieved;
            case "unlocked":
                return b.achieved - a.achieved;
            default:
                return 0;
        }
    }).filter((game) => {
        let nameMatch = true
        if (data['data'][1]) {
            const gameName = game
                .gameName
                .toLowerCase();

            // Фильтрация по имени игры

            nameMatch = gameName
                .toLowerCase()
                .includes(searchQueryGameName.toLowerCase());
        }
        const nameAchMatch = game['achivment']
            .displayName
            .toLowerCase()
            .includes(searchQueryAch.toLowerCase())
        // Фильтрация по времени
        let completionMatch;
        if (selectedCompletionFilterValue == null) {
            completionMatch = true;
        } else if (selectedCompletionFilterValue.startsWith("percent")) {
            const rangeBounds = selectedCompletionFilterValue
                .replace("percent", "")
                .split("-")
                .map(Number);

            completionMatch = rangeBounds[0] < game['achivment'].percent && game['achivment'].percent < rangeBounds[1];
        } else {
            completionMatch = true;
        }
        // Фильтрация по завершению Возвращаем true, только если все условия выполняются
        return nameMatch && completionMatch && nameAchMatch;
    });
    useEffect(useCallback(() => {
        try {

            setGame(data['data'][0]);
            const all_ach = data['data'][0]
            setAllAch(all_ach);
        } catch (error) {
            window.alert(error.message);
        }
    }, [game, allAChPage]), []);
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
            setSelectedValue(selectedValue + "rev");
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

    if (!data['data'][1]) {
        sortingOptions.push({value: 'unlocked', label: 'Gained', reverseValue: 'unlockedrev'})
    }
    return (
        <I18nextProvider i18n={i18n}>
            <div className="AchSet">
                <div className="details-container">
                    <div className="inputSortFilterContainerAch">
                        {data['data'][1] && (<IdKeyInput
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
                                            ? "active"
                                            : ""}
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
                        className={ach['achivment'].percent <= 5
                        ? "rare1"
                        : ach['achivment'].percent <= 20
                            ? "rare2"
                            : ach['achivment'].percent <= 45
                                ? "rare3"
                                : ach['achivment'].percent <= 60
                                    ? "rare4"
                                    : "rare5"}
                        key={(data['data'][1]
                        ? ach['gameName']
                        : "") + ach['achivment'].displayName + ach['achivment'].percent + ach['achivment'].name}
                        src={ach['achivment'].achieved
                        ? ach['achivment'].icon
                        : ach['achivment'].icongray}
                        alt={ach['achivment'].displayName}
                        title={`${data['data'][1]
                        ? ach['gameName'] + '\n'
                        : ""}${ach['achivment']
                            .displayName}\n${ach['achivment']
                            .description}\n${ach['achivment']
                            .percent
                            .toFixed(2)}\n${new Date(ach['achivment'].unlocktime * 1000)}`}/>))}
                </div>
            </div>
        </I18nextProvider>
    );
}
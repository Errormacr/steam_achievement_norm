import React,{useCallback, useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import App from "./main_window";
import {GameCard} from "./GameCard";
import {I18nextProvider,useTranslation} from 'react-i18next';
import i18n from 'i18next';
import ScrollToTopButton from "./ScrollToTopButton";
import "./scss/Games.scss";
import './scss/FilterSort.scss';
import IdKeyInput from "./IdKeyInput";

let root = ReactDOM.createRoot(document.getElementById("root"));
function rend_app() {
    root.render(<App/>);
}

export default function Games() {
    const [Ach,
        setAch] = useState([]);
    const [isDropdownOpen,
        setDropdownOpen] = useState(false);
    const [selectedValue,
        setSelectedValue] = useState < string | null > ('last-launch');
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
    const handleItemClick = (value : string) => {
        setSelectedValue(value);
        setDropdownOpen(false);
    };
    const [searchQuery,
        setSearchQuery] = useState('');
    const handleSearchInputChange = (e : React.ChangeEvent < HTMLInputElement >) => {
        setSearchQuery(e.target.value);
    };

    const filteredAch = Ach.filter((game) => {

        const gameName = game
            .gameName
            .toLowerCase();

        // Фильтрация по имени игры
        const nameMatch = gameName.includes(searchQuery.toLowerCase());

        // Фильтрация по времени
        const timeMatch = selectedTimeFilterValue == null || game.playtime > Number(selectedTimeFilterValue);
        let completionMatch;
        if (selectedCompletionFilterValue == "Completed") {
            completionMatch = game.percent == 100;

        } else if (selectedCompletionFilterValue == null) {
            completionMatch = true;
        } else if (selectedCompletionFilterValue.startsWith("percent")) {
            const rangeBounds = selectedCompletionFilterValue
                .replace("percent", "")
                .split("-")
                .map(Number);

            completionMatch = rangeBounds[0] < game.percent && game.percent < rangeBounds[1];
        } else {
            completionMatch = true;
        }
        // Фильтрация по завершению Возвращаем true, только если все условия выполняются
        return nameMatch && timeMatch && completionMatch;
    }).sort((a : any, b : any) => {
        switch (selectedValue) {
            case "last-launch":
                return b.last_launch_time - a.last_launch_time;
            case "game-playtime":
                return b.playtime - a.playtime;
            case "all-ach":
                return b.all - a.all;
            case "gained-ach":
                return b.gained - a.gained;
            case "non-gained-ach":
                return (b.all - b.gained) - (a.all - a.gained);
            case "game-percent":
                return b.percent - a.percent;
            case "last-launchrev":
                return a.last_launch_time - b.last_launch_time;
            case "game-playtimerev":
                return a.playtime - b.playtime;
            case "all-achrev":
                return a.all - b.all;
            case "gained-achrev":
                return a.gained - b.gained;
            case "non-gained-achrev":
                return (a.all - a.gained) - (b.all - b.gained);
            case "game-percentrev":
                return a.percent - b.percent;
            default:
                return 0;
        }
    });
    const handleTimeFilterItemClick = (value : string) => {
        if (selectedTimeFilterValue === value) {
            setSelectedTimeFilterValue(null);
        } else {
            setSelectedTimeFilterValue(value);
        }
        setTimeFilterDropdownOpen(false);
    };
    const handleCompletionFilterItemClick = (value : string) => {
        if (selectedCompletionFilterValue === value) {
            setSelectedCompletionFilterValue(null);
        } else {
            setSelectedCompletionFilterValue(value);
        }
        setCompletedFilterDropdownOpen(false);
    };

    const handleToggleArrows = () => {
        const container = document.getElementById("game_container");
        const elements = Array.from(container.children);
        elements.reverse()
        elements.forEach((element) => container.appendChild(element));
        if (isArrowDownOpen) {
            setIsArrowUpOpen(true);
            setIsArrowDownOpen(false);
        } else {
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
    const {t} = useTranslation();

    useEffect(useCallback(() => {
        try {
            root = ReactDOM.createRoot(document.getElementById("root"));
            const ach = JSON.parse(localStorage.getItem("ach"));
            setAch(ach);

            return () => {
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('click', handleFilterOutsideClick);
            };
        } catch (error) {
            window.alert(error.message);
        }
    }, []), []);
    const sortingOptions = [
        {
            value: 'last-launch',
            label: 'LastLaunchSort',
            reverseValue: 'last-launchrev'
        }, {
            value: 'game-percent',
            label: 'PercentAchSort',
            reverseValue: 'game-percentrev'
        }, {
            value: 'all-ach',
            label: 'AllAChInGameSort',
            reverseValue: 'all-achrev'
        }, {
            value: 'gained-ach',
            label: 'GainedAchSort',
            reverseValue: 'gained-achrev'
        }, {
            value: 'non-gained-ach',
            label: 'NonGainedAchSort',
            reverseValue: 'non-gained-achrev'
        }, {
            value: 'game-playtime',
            label: 'PlayTimeSort',
            reverseValue: 'game-playtimerev'
        }
    ];
    return (
        <I18nextProvider i18n={i18n}>
            <div className="gameFilterCont">
                <div className="inputSortFilterContainerGames">
                    <IdKeyInput placeholder={t('SearchGames')} value={searchQuery} onChange={handleSearchInputChange}/>
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
                        <button
                            className="dropdown-button"
                            onClick={() => setTimeFilterDropdownOpen(!isTimeFilterDropdownOpen)}>
                            {t('TimeFilter')}
                        </button>
                        {isTimeFilterDropdownOpen && (
                            <ul className="dropdown-list">
                                {[
                                    {
                                        value: '1000',
                                        label: 'Above1000hour'
                                    }, {
                                        value: '500',
                                        label: 'Above500hour'
                                    }, {
                                        value: '100',
                                        label: 'Above100hour'
                                    }, {
                                        value: '50',
                                        label: 'Above50hour'
                                    }, {
                                        value: '20',
                                        label: 'Above20hour'
                                    }, {
                                        value: '2',
                                        label: 'Above2hour'
                                    }
                                ].map((filter) => (
                                    <li
                                        key={filter.value}
                                        className={selectedTimeFilterValue === filter.value
                                        ? 'active'
                                        : ''}
                                        onClick={() => handleTimeFilterItemClick(filter.value)}>
                                        {t(filter.label)}
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
                            {t('CompletedFilter')}
                        </button>

                        {isCompletedFilterDropdownOpen && (
                            <ul className="dropdown-list">
                                {[
                                    'Completed',
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
            <button className="gameButton return" onClick={rend_app}>{t('Return')}</button>
            <div id="header key">
                <ScrollToTopButton/>

                <br/>
                <div id="game_container" className="game_container">
                    {filteredAch.map((game) => (<GameCard key={game.appid} window="games" game={game}/>))}
                </div>
            </div>
        </I18nextProvider>
    );
}

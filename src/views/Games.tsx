import {useCallback, useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import App from "./main_window";
import {GameCard} from "./GameCard";
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import ScrollToTopButton from "./ScrollToTopButton";
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
        if (selectedCompletionFilterValue == "percent0-10") {
            completionMatch = game.percent < 10;
        } else if (selectedCompletionFilterValue == "percent10-20") {
            completionMatch = 10 < game.percent && game.percent < 20;
        } else if (selectedCompletionFilterValue == "percent20-30") {
            completionMatch = 20 < game.percent && game.percent < 30;
        } else if (selectedCompletionFilterValue == "percent30-40") {
            completionMatch = 30 < game.percent && game.percent < 40;
        } else if (selectedCompletionFilterValue == "percent40-50") {
            completionMatch = 40 < game.percent && game.percent < 50;
        } else if (selectedCompletionFilterValue == "percent50-60") {
            completionMatch = 50 < game.percent && game.percent < 60;
        } else if (selectedCompletionFilterValue == "percent60-70") {
            completionMatch = 60 < game.percent && game.percent < 70;
        } else if (selectedCompletionFilterValue == "percent70-80") {
            completionMatch = 70 < game.percent && game.percent < 80;
        } else if (selectedCompletionFilterValue == "percent80-90") {
            completionMatch = 80 < game.percent && game.percent < 90;
        } else if (selectedCompletionFilterValue == "percent90-100") {
            completionMatch = 90 < game.percent && game.percent < 100;
        } else if (selectedCompletionFilterValue == "Completed") {

            completionMatch = game.percent == 100;
        } else {
            completionMatch = true
        }
        console.log(game)
        // Фильтрация по завершению Возвращаем true, только если все условия выполняются
        return nameMatch && timeMatch && completionMatch;
    }).sort((a : any, b : any) => {
        if (selectedValue === "last-launch") {
            return b.last_launch_time - a.last_launch_time
        } else if (selectedValue === "game-playtime") {
            return b.playtime - a.playtime;
        } else if (selectedValue === "all-ach") {
            return b.all - a.all;
        } else if (selectedValue === "gained-ach") {
            return b.gained - a.gained;
        } else if (selectedValue === "non-gained-ach") {
            return (b.all - b.gained) - (a.all - a.gained);
        } else if (selectedValue === "game-percent") {
            return b.percent - a.percent;
        } else if (selectedValue === "last-launchrev") {
            return a.last_launch_time - b.last_launch_time
        } else if (selectedValue === "game-playtimerev") {
            return a.playtime - b.playtime;
        } else if (selectedValue === "all-achrev") {
            return a.all - b.all;
        } else if (selectedValue === "gained-achrev") {
            return a.gained - b.gained;
        } else if (selectedValue === "non-gained-achrev") {
            return (a.all - a.gained) - (b.all - b.gained);
        } else if (selectedValue === "game-percentrev") {
            return a.percent - b.percent;
        } else {
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
    const {t} = useTranslation();
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
    useEffect(useCallback(() => {
        try {
            root = ReactDOM.createRoot(document.getElementById("root"));
            const ach = JSON.parse(localStorage.getItem("ach"));
            ach.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time);
            console.log(ach);
            setAch(ach);

            return () => {
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('click', handleFilterOutsideClick);
            };
        } catch (error) {
            window.alert(error.message);
        }
    }, []), []);

    return (
        <I18nextProvider i18n={i18n}>
            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="inputSortFilterContainer">
                    <input
                        type="text"
                        className="idKeyInput"
                        placeholder={t('SearchGames')}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        style={{
                        marginRight: '10px'
                    }}/> {/* Добавляем кнопки для сортировки */}

                    <div ref={listRef} className="dropdown-container">
                        <button
                            className="dropdown-button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}>
                            {t('SortBy')}
                        </button>

                        {isDropdownOpen && (
                            <ul className="dropdown-list">
                                <li
                                    className={(selectedValue === 'last-launch' || selectedValue === 'last-launchrev')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('last-launch')
                                    } else {
                                        handleItemClick('last-launchrev')
                                    }
                                }}>{t('LastLaunchSort')}</li>
                                <li
                                    className={(selectedValue === 'game-percent' || selectedValue === 'game-percentrev')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('game-percent')
                                    } else {
                                        handleItemClick('game-percentrev')
                                    }
                                }}>{t('PercentAchSort')}</li>
                                <li
                                    className={(selectedValue === 'all-ach' || selectedValue === 'all-achrev')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('all-ach')
                                    } else {
                                        handleItemClick('all-achrev')
                                    }
                                }}>{t('AllAChInGameSort')}</li>
                                <li
                                    className={(selectedValue === 'gained-ach' || selectedValue === 'gained-achrev')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('gained-ach')
                                    } else {
                                        handleItemClick('gained-achrev')
                                    }
                                }}>{t('GainedAchSort')}</li>
                                <li
                                    className={(selectedValue === 'non-gained-ach' || selectedValue === 'non-gained-ach')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('non-gained-ach')
                                    } else {
                                        handleItemClick('non-gained-achrev')
                                    }
                                }}>{t('NonGainedAchSort')}</li>
                                <li
                                    className={(selectedValue === 'game-playtime' || selectedValue === 'game-playtimerev')
                                    ? "active"
                                    : ""}
                                    onClick={() => {
                                    if (isArrowDownOpen) {
                                        handleItemClick('game-playtime')
                                    } else {
                                        handleItemClick('game-playtimerev')
                                    }
                                }}>{t('PlayTimeSort')}</li>
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
                                <li
                                    className={selectedTimeFilterValue === '1000'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('1000')}>
                                    {t('Above1000hour')}
                                </li>
                                <li
                                    className={selectedTimeFilterValue === '500'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('500')}>
                                    {t('Above500hour')}
                                </li>
                                <li
                                    className={selectedTimeFilterValue === '100'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('100')}>
                                    {t('Above100hour')}
                                </li>
                                <li
                                    className={selectedTimeFilterValue === '50'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('50')}>
                                    {t('Above50hour')}
                                </li>
                                <li
                                    className={selectedTimeFilterValue === '20'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('20')}>
                                    {t('Above20hour')}
                                </li>
                                <li
                                    className={selectedTimeFilterValue === '2'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleTimeFilterItemClick('2')}>
                                    {t('Above2hour')}
                                </li>

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

                                <li
                                    className={selectedCompletionFilterValue === 'Completed'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('Completed')}>
                                    {t('Completed')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent90-100'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent90-100')}>
                                    {t('percent90-100')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent80-90'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent80-90')}>
                                    {t('percent80-90')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent70-80'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent70-80')}>
                                    {t('percent70-80')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent60-70'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent60-70')}>
                                    {t('percent60-70')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent50-60'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent50-60')}>
                                    {t('percent50-60')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent40-50'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent40-50')}>
                                    {t('percent40-50')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent30-40'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent30-40')}>
                                    {t('percent30-40')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent20-30'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent20-30')}>
                                    {t('percent20-30')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent10-20'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent10-20')}>
                                    {t('percent10-20')}
                                </li>
                                <li
                                    className={selectedCompletionFilterValue === 'percent0-10'
                                    ? "active"
                                    : ""}
                                    onClick={() => handleCompletionFilterItemClick('percent0-10')}>
                                    {t('percent0-10')}
                                </li>

                            </ul>
                        )}
                    </div>
                    <div
                        style={{
                        marginRight: "0.5rem"
                    }}
                        onClick={() => handleToggleArrows()}>
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
            <button
                className="gameButton"
                onClick={rend_app}
                style={{
                marginLeft: "10px",
                marginRight: "10px",
                position: "absolute",
                width: "120px",
                left: "0",
                right: "0",
                top: "1%"
            }}>{t('Return')}</button>
            <div style={{}} id="header key">
                <ScrollToTopButton/>

                <br/>
                <div
                    id="game_container"
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    flexWrap: "wrap"
                }}>
                    {filteredAch.map((game) => (<GameCard
                        style={{
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5), 0 0 0 5px white inset"
                    }}
                        key={game.appid}
                        window="games"
                        game={game}/>))}
                </div>
            </div>
        </I18nextProvider>
    );
}

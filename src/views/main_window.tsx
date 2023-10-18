import {useCallback, useEffect, useState} from "react";
import Ach_cont from './last_ach_containter';
import ReactDOM from "react-dom/client";
import Games from './Games';
import {GameCard, UnixTimestampToDate} from './GameCard';
import ProgressRad from "./rad_progress";
import AchPage from "./AchivmentsPage";
import Settings from "./Settings";
import LoadingOverlay from 'react-loading-overlay-ts';
import BounceLoader from 'react-spinners/BounceLoader'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {I18nextProvider} from 'react-i18next';
import {useTranslation} from 'react-i18next';
import IdKeyInput from "./IdKeyInput";
import GameButton from "./GameButton";
import {FriendTable} from "./FriendsMainScreen";
import i18n from 'i18next';
import "./scss/MainWindow.scss"

export default function App() {
    const [SteamWebApiKey,
        setSteamWebApiKey] = useState("");
    const [ConstSteamWebApiKey,
        setConstSteamWebApiKey] = useState("");
    const [ConstSteamId,
        setConstSteamId] = useState("");
    const [SteamId,
        setSteamId] = useState("");
    const [personalName,
        setpersonalName] = useState("")
    const [Ach,
        setAch] = useState("")
    const [gamesCount,
        setgamesCount] = useState("")
    const [avaUrl,
        setavaUrl] = useState("")
    const [percent,
        setpercent] = useState("")
    const [games,
        setGames] = useState([]);
    const [load,
        setLoad] = useState(false);

    const [apiKeyError,
        setApiKeyError] = useState("");
    const [steamIdError,
        setSteamIdError] = useState("");
    const {t} = useTranslation();
    const RECENT_GAMES_API = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/`;
    const PLAYER_SUMMARIES_API = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`;
    const OWNED_GAMES_API = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`;

    const get_api = useCallback(async(urls_a : string[]) => {
        try {
            const data_key = localStorage.getItem("api-key");
            const data_st_id = localStorage.getItem("steamId");
            const ret_data = await fetch(`http://localhost:4500/data?steam_ip=${data_st_id}&key=${data_key}&lang=${t('steamLanguage')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appid: JSON.stringify(urls_a)
                })
            });
            return ret_data.json();
        } catch (error) {
            console.error(error);
        }
    }, []);
    const update_user_data = useCallback(async() => {
        const data_key = localStorage.getItem('api-key');
        const data_st_id = localStorage.getItem('steamId');
        const ach_container = ReactDOM.createRoot(document.getElementById("container"));

        if (data_key && data_st_id) {
            try {
                const recent_game = `${RECENT_GAMES_API}?key=${data_key}&steamid=${data_st_id}&format=json`;
                let response = await fetch(recent_game);
                let data = await response.json();
                const before = localStorage.getItem("recent");

                if ((before == undefined) || (before != JSON.stringify(data)) || (before == null)) {
                    const [data,
                        user_data,
                        games_data] = await Promise.all([
                        fetch(recent_game).then(response => response.json()),
                        fetch(`${PLAYER_SUMMARIES_API}?key=${data_key}&steamids=${data_st_id}`).then(response => response.json()),
                        fetch(`${OWNED_GAMES_API}?key=${data_key}&steamid=${data_st_id}&format=json&include_appinfo=true&include_played_free_games=true`).then(response => response.json())
                    ]);

                    localStorage.setItem("recent", JSON.stringify(data));

                    const personalName = user_data.response.players[0].personaname;
                    setpersonalName(personalName);
                    const avaUrl = user_data.response.players[0].avatarfull;
                    localStorage.setItem('ava', avaUrl);
                    localStorage.setItem('name', personalName);
                    setavaUrl(avaUrl);
                    setgamesCount(games_data.response.games.length);
                    const data_g_ach_url : any[] = [];
                    for (let ach in games_data.response.games) {
                        data_g_ach_url.push([
                            games_data.response.games[ach]['appid'],
                            games_data.response.games[ach]['rtime_last_played'],
                            (games_data.response.games[ach].playtime_forever / 60).toFixed(1)
                        ]);
                    }

                    const ach = await calculateAchievementCount(data_g_ach_url);
                    setAch(ach[0].toString());
                    const predproc = localStorage.getItem('percent');
                    localStorage.setItem('percent', ach[1].toString());
                    setpercent(ach[1].toString());
                    ach_container.render(<Ach_cont/>);

                    toast.success("+ " + (parseFloat(ach[1].toString()) - parseFloat(predproc)).toFixed(2).toString() + "% " + t('averageUp'));
                } else {
                    try {
                        setavaUrl(localStorage.getItem('ava'));
                        setpersonalName(localStorage.getItem('name'));
                        const ach = localStorage.getItem('ach');
                        const data = JSON.parse(ach);
                        setGames(data.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time).slice(0, 3));
                        setgamesCount(data.length);
                        let achiv_ach_count = 0;
                        let percent = 0;
                        let game_with_ach_count = 0;
                        for (let ach of data) {
                            if (ach.Achievement) {
                                let ach_arr = ach
                                    .Achievement
                                    .filter((ach : any) => (ach as {
                                        achieved : number
                                    }).achieved == 1);
                                let all_ach_arr = ach.Achievement;
                                if (ach_arr.length > 0) {
                                    percent += ach_arr.length / all_ach_arr.length * 100;
                                    game_with_ach_count += 1;
                                }
                                achiv_ach_count += ach_arr.length;
                            }
                        }
                        setpercent((percent / game_with_ach_count).toFixed(2).toString())
                        setAch(achiv_ach_count.toString());

                        ach_container.render(<Ach_cont/>)

                    } catch (e) {
                        console.error(e);
                        localStorage.setItem("recent", "");
                    }
                }

            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const calculateAchievementCount = useCallback(async(data_g_ach_url : string[]) => {
        setLoad(true);
        const data = await get_api(data_g_ach_url);
        const data_with_percent_etc = [];

        let achiv_ach_count = 0;
        let all_ach_count = 0;
        let game_with_ach_count = 0;
        if (data.length > 0) {
            for (const ach of data.flat()) {
                if (ach.Achievement) {
                    const {Achievement} = ach;
                    const ach_arr = Achievement.filter(({achieved} : {
                        achieved: number
                    }) => achieved === 1);

                    if (ach_arr.length > 0) {
                        all_ach_count += (ach_arr.length / Achievement.length) * 100;
                        game_with_ach_count += 1;
                    }

                    data_with_percent_etc.push({
                        ...ach,
                        percent: (ach_arr.length / Achievement.length) * 100,
                        gained: ach_arr.length,
                        all: Achievement.length
                    });

                    achiv_ach_count += ach_arr.length;
                }
            }

            const sortedGames = data_with_percent_etc.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time).slice(0, 3);

            const achData = JSON.stringify(data_with_percent_etc);
            localStorage.setItem('ach', achData);

            setGames(sortedGames);
            setLoad(false);
            toast.success(t('Success'));
            return [
                achiv_ach_count,
                (all_ach_count / game_with_ach_count).toFixed(2),
                game_with_ach_count
            ];
        } else {
            setLoad(false);
            toast.error(t('LoadFail'));
            console.log("data is 0");
            return [0, 0, 0]
        }
    }, [get_api]);
    const handleKeyChange = () => {
        setConstSteamWebApiKey(SteamWebApiKey);
        localStorage.setItem('recent', '');
        localStorage.setItem('api-key', SteamWebApiKey);
        update_user_data();
    };
    const handleIdChange = () => {
        setConstSteamId(SteamId);
        localStorage.setItem("recent", "");
        localStorage.setItem('steamId', SteamId);
        update_user_data();
    };
    const handleKeyClear = () => {
        setConstSteamWebApiKey("");
        localStorage.setItem('api-key', "");
    };
    const handleIdClear = () => {
        setConstSteamId("");
        localStorage.setItem('steamId', "");
    };
    const handleUpdate = () => {
        localStorage.setItem('recent', "");
        update_user_data();
    };
    function showClears() {
        const buttons = ["keyChangeButton", "keyClearButton", "steamIdChangeButton", "steamIdclearButton"];
        const button = document.getElementById("hideButton");
        const div = document.getElementById("clearsButtons");
        const checkDiv = document.getElementById("clearDiv");

        button.style.display = "none";
        div.style.display = "flex";
        checkDiv.style.justifyContent = "center";

        function handleDocumentClick(event : any) {
            if (!checkDiv.contains(event.target) && !buttons.includes(event.target.id)) {
                div.style.display = 'none';
                checkDiv.style.justifyContent = "space-between";
                button.style.display = "block";
                document.removeEventListener('click', handleDocumentClick);
            }
        }

        document.addEventListener('click', handleDocumentClick);
    };
    useEffect(useCallback(() => {
        try {
            const data = localStorage.getItem("api-key");
            if (data != undefined) {
                setConstSteamWebApiKey(data);
            }
            const data_st_id = localStorage.getItem("steamId");
            if (data_st_id != undefined) {
                setConstSteamId(data_st_id);
            }
            update_user_data();
            console.log(percent);

        } catch (error) {
            window.alert(error.message);
        }
    }, []), []);

    return (
        <I18nextProvider i18n={i18n}>
            <div>
                <LoadingOverlay active={load} spinner={< BounceLoader />}>

                    <div id="header key" className="header">
                        <div>
                            <div id="clearDiv" className="clearDiv">
                                <GameButton
                                    id='hideButton'
                                    additionalClass="ButtonToHide"
                                    text={t('changeIdKeyButton')}
                                    onClick={showClears}/>
                                <div id="clearsButtons" className="hiden">
                                    <div>
                                        {ConstSteamWebApiKey == "" && (<IdKeyInput
                                            onChange={(event) => {
                                            const value = event.target.value;
                                            const regex = /^[A-Z0-9]+$/;
                                            if (regex.test(value) && value.length == 32) {
                                                setSteamWebApiKey(value);
                                                setApiKeyError("");
                                            } else if (value.length != 32) {
                                                setApiKeyError(t('ApiKeylengthMismatch'));
                                            } else if (value == "") {
                                                setApiKeyError(t('ApiKeyRequired'));
                                            } else {
                                                setApiKeyError(t('ApiKeyError'));
                                            }
                                        }}
                                            placeholder="Steam api key"/>)}
                                        {apiKeyError && <div className="input-error">{apiKeyError}</div>}</div>
                                    {ConstSteamWebApiKey == "" && (<GameButton
                                        text={t('ChangeKey')}
                                        onClick={handleKeyChange}
                                        id='keyChangeButton'/>)}
                                    {ConstSteamWebApiKey != "" && (<GameButton text={t('ClearKey')} onClick={handleKeyClear} id='keyClearButton'/>)}
                                    <div>
                                        {ConstSteamId == "" && (<IdKeyInput
                                            onChange={(event) => {
                                            const value = event.target.value;
                                            const regex = /^[0-9]+$/;
                                            if (regex.test(value)) {
                                                setSteamWebApiKey(value);
                                                setSteamIdError("");
                                            } else if (value == "") {
                                                setSteamIdError(t('SteamIdRequired'));
                                            } else {
                                                setSteamIdError(t('SteamIdError'));
                                            }
                                        }}
                                            placeholder="Steam id"/>)}
                                        {steamIdError && <div className="input-error">{steamIdError}</div>}</div>
                                        {ConstSteamId == "" && (<GameButton
                                            text={t('ChangeSteamID')}
                                            onClick={handleIdChange}
                                            id='steamIdChangeButton'/>)}

                                    {ConstSteamId != "" && (<GameButton
                                        text={t('ClearId')}
                                        onClick={handleIdClear}
                                        id='steamIdclearButton'/>)}
                                    <GameButton text={t('Update')} onClick={handleUpdate} id=''/>
                                </div>
                                <Settings/>
                            </div>
                            <div className="MainCont">
                                {personalName && (
                                    <div className="nickname-container">
                                        <label className="nickname">{personalName}</label>
                                        <br></br>
                                        <img src={avaUrl}></img>
                                        <br ></br>
                                        <div className="stats-container">
                                            <label className="nickname">{t('Ach')}: {Ach}</label>
                                            <br></br>
                                            <br></br>
                                            <label className="nickname">{t('Games')}: {gamesCount}</label>
                                        </div>
                                        <br></br>
                                        <GameButton
                                            id=''
                                            additionalClass="gamesAchButtons"
                                            onClick={(event) => {
                                            const root = ReactDOM.createRoot(document.getElementById("root"));
                                            root.render(<Games/>);
                                        }}
                                            text={t('GamesWithAch')}/>

                                        <br/>
                                        <GameButton
                                            id=''
                                            additionalClass="gamesAchButtons"
                                            onClick={(event) => {
                                            const root = ReactDOM.createRoot(document.getElementById("root"));
                                            root.render(<AchPage/>);
                                        }}
                                            text={t('AllAch')}/>
                                        <br></br>
                                        <div className="gain-nongainMain">
                                            <ProgressRad
                                                title={t('AverageProcent')}
                                                data-progress={percent}
                                                SizeVnu={'9rem'}
                                                SizeVne={'10rem'}/></div>
                                    </div>
                                )}
                                <div className="main-game-cards">
                                    {games.map((game) => (<GameCard game={game} backWindow="main"/>))}
                                </div>
                                <div className="with-friends">
                                    <div className="last-ach-main" id="container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
                <br></br>
                <ToastContainer/>
            </div>
        </I18nextProvider>
    )
}
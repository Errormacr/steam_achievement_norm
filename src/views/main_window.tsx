import {useCallback, useEffect, useState} from "react";
import Ach_cont from './last_ach_containter';
import ReactDOM from "react-dom/client";
import Games, {GameCard} from './Games';
import ProgressRad from "./rad_progress";
import AchPage from "./AchivmentsPage";
import LoadingOverlay from 'react-loading-overlay-ts';
import BounceLoader from 'react-spinners/BounceLoader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

    const get_api = useCallback(async(urls_a : string[]) => {
        try {
            const data_key = localStorage.getItem("api-key");
            const data_st_id = localStorage.getItem("steamId");
            const ret_data = await fetch(`http://localhost:4500/data?steam_ip=${data_st_id}&key=${data_key}`, {
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
                const recent_game = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${data_key}&steamid=${data_st_id}&format=json`;
                let response = await fetch(recent_game);
                let data = await response.json();
                const before = localStorage.getItem("recent");

                if ((before == undefined) || (before != JSON.stringify(data)) || (before == null)) {
                    const [data,
                        user_data,
                        games_data] = await Promise.all([
                        fetch(recent_game).then(response => response.json()),
                        fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${data_key}&steamids=${data_st_id}`).then(response => response.json()),
                        fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${data_key}&steamid=${data_st_id}&format=json&include_appinfo=true&include_played_free_games=true`).then(response => response.json())
                    ]);

                    localStorage.setItem("recent", JSON.stringify(data));

                    const personalName = user_data.response.players[0].personaname;
                    setpersonalName(personalName);
                    const avaUrl = user_data.response.players[0].avatarfull;
                    localStorage.setItem('ava', avaUrl);
                    localStorage.setItem('name', personalName);
                    setavaUrl(avaUrl);

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
                    setpercent(ach[1].toString());

                    ach_container.render(<Ach_cont/>);

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
            toast.success('Success');
            return [
                achiv_ach_count,
                (all_ach_count / game_with_ach_count).toFixed(2),
                game_with_ach_count
            ];
        } else {
            setLoad(false);
            toast.error('Failed to load');
            console.log("data is 0");
            return [0, 0, 0]
        }
    }, [get_api]);

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

        } catch (error) {
            window.alert(error.message);
        }
    }, []), []);
    return (
        <div>
        <LoadingOverlay active={load} spinner={< BounceLoader />}>

            <div
                id="header key"
                style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <div>
                    <div id="clearDiv" className="clearDiv">
                        <button
                            style={{
                            marginLeft: "1.5rem"
                        }}
                            id="hideButton"
                            className="ButtonToHide gameButton"
                            onClick={showClears}>Сменить ключ или ИД</button>
                        <div
                            style={{
                            width: "100%",
                            height: "3rem",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "5rem"
                        }}
                            id="clearsButtons"
                            className="hiden">
                            <div>
                                {ConstSteamWebApiKey == "" && (<input
                                    placeholder="Steam api key"
                                    id="key"
                                    onChange={(event) => {
                                    setSteamWebApiKey(event.target.value);
                                }}/>)}
                                {ConstSteamWebApiKey == "" && (
                                    <button
                                        type="button"
                                        style={{
                                        marginRight: "1rem"
                                    }}
                                        className="gameButton"
                                        id="keyChangeButton"
                                        onClick={(event) => {
                                        setConstSteamWebApiKey(SteamWebApiKey);
                                        localStorage.setItem("recent", "");
                                        localStorage.setItem('api-key', SteamWebApiKey);
                                        update_user_data();
                                    }}>Change key</button>
                                )}

                                {ConstSteamWebApiKey != "" && (
                                    <button
                                        className="gameButton"
                                        type="button"
                                        id="keyClearButton"
                                        style={{
                                        marginRight: "1rem"
                                    }}
                                        onClick={(event) => {
                                        setConstSteamWebApiKey("");
                                        localStorage.setItem('api-key', "");
                                    }}>Clear key</button>
                                )}
                            </div>
                            <div>
                                {ConstSteamId == "" && (<input
                                    placeholder="Steam id"
                                    id="key"
                                    onChange={(event) => {
                                    setSteamId(event.target.value);
                                }}/>)}

                                {ConstSteamId == "" && (
                                    <button
                                        className="gameButton"
                                        type="button"
                                        id="steamIdChangeButton"
                                        onClick={(event) => {
                                        setConstSteamId(SteamId);
                                        localStorage.setItem("recent", "");
                                        localStorage.setItem('steamId', SteamId);
                                        update_user_data();
                                    }}>Change steamID</button>
                                )}</div>

                            {ConstSteamId != "" && (
                                <button
                                    type="button"
                                    className="gameButton"
                                    id="steamIdclearButton"
                                    onClick={(event) => {
                                    setConstSteamId("");
                                    localStorage.setItem('steamId', "");
                                }}>Clear id</button>
                            )}
                            <button
                                type="button"
                                className="gameButton"
                                style={{
                                marginLeft: "1rem"
                            }}
                                onClick={(event) => {
                                localStorage.setItem('recent', "");
                                update_user_data();
                            }}>Update</button>
                        </div>
                    </div>

                    {personalName && (
                        <div
                            style={{
                            marginTop: "4rem",
                            marginLeft: "1.5rem"
                        }}>
                            <label className="nickname">{personalName}</label>
                            <br></br>
                            <img src={avaUrl}></img>
                            <br ></br>
                            <div
                                style={{
                                marginTop: "1rem"
                            }}>
                                <label className="nickname">Achievements: {Ach}</label>
                                <br></br>
                                <br></br>
                                <label className="nickname">Games: {gamesCount}</label>
                            </div>
                            <br></br>
                            <button
                                className="gameButton"
                                style={{
                                textTransform: "lowercase"
                            }}
                                onClick={() => {
                                const root = ReactDOM.createRoot(document.getElementById("root"));
                                root.render(<Games/>);
                            }}>Games with ach</button>
                            <button
                                className="gameButton"
                                style={{
                                marginLeft: "0.3rem",
                                textTransform: "lowercase"
                            }}
                                onClick={() => {
                                const root = ReactDOM.createRoot(document.getElementById("root"));
                                root.render(<AchPage/>);
                            }}>All ach</button>
                            <br></br>
                            <div
                                style={{
                                marginTop: "1em",
                                marginLeft: "1em"
                            }}>
                                <ProgressRad title="average percent" data-progress={percent}/></div>
                        </div>
                    )}</div>
                <div
                    style={{
                    marginTop: "4rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em"
                }}>
                    {games.map((game) => (<GameCard game={game} backWindow="main"/>))}
                </div>
                <div
                    style={{
                    marginTop: "4rem"
                }}
                    id="container"></div>
            </div>
        </LoadingOverlay>
        <br></br>
        <ToastContainer />
        </div>
    )
}
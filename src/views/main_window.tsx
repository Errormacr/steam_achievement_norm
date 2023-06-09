import {useCallback, useEffect, useState} from "react";
import Ach_cont from './last_ach_containter';
import ReactDOM from "react-dom/client";
import Games, {GameCard} from './Games';
import ProgressRad from "./rad_progress"

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
            const recent_game = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${data_key}&steamid=${data_st_id}&format=json`;
            const before = localStorage.getItem("recent");
            fetch(recent_game)
                .then(response => response.json())
                .then(data => {
                    let check = false;
                    if ((before == undefined) || (before != JSON.stringify(data)) || (before == null)) {
                        check = true;
                        localStorage.setItem("recent", JSON.stringify(data));
                    }
                    if (check) {
                        let user_url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${data_key}&steamids=${data_st_id}`;
                        const data_json = fetch(user_url)
                            .then(response => response.json())
                            .then(data => {
                                const personalName = data.response.players[0].personaname;
                                setpersonalName(personalName);
                                const avaUrl = data.response.players[0].avatarfull;
                                localStorage.setItem('ava', avaUrl);
                                localStorage.setItem('name', personalName);
                                setavaUrl(avaUrl);
                            })
                        let url_games = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${data_key}&steamid=${data_st_id}&format=json&include_appinfo=true&include_played_free_games=true`;
                        let data_g_j;
                        const data_g_ach_url : any[] = [];
                        const data_games_res = fetch(url_games).then((response) => response.json()).then((data) => {
                            data_g_j = data;

                            setgamesCount(data_g_j.response.game_count);
                            if (data_g_j != undefined) {
                                for (let ach in data_g_j.response.games) {
                                    data_g_ach_url.push([
                                        data_g_j.response.games[ach]['appid'],
                                        data_g_j.response.games[ach]['rtime_last_played'],
                                        (data_g_j.response.games[ach].playtime_forever / 60).toFixed(1)
                                    ]);
                                    // выполнение операций на каждой итерации цикла
                                }
                                let ach = calculateAchievementCount(data_g_ach_url);
                                ach.then((ach) => {
                                    setAch(ach[0].toString());
                                    setpercent(ach[1].toString());

                                    ach_container.render(<Ach_cont/>)
                                });
                            }
                        }).catch((error) => console.error(error));
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

                });
        }
    }, []);
    const calculateAchievementCount = useCallback(async(data_g_ach_url : string[]) => {
        const data = await get_api(data_g_ach_url);
        let achiv_ach_count = 0;
        let all_ach_count = 0;
        let game_with_ach_count = 0;
        let data_with_percent_etc = [];

        for (let ach of data) {
            if (ach.Achievement) {
                let all_arr = ach.Achievement;
                let ach_arr = ach
                    .Achievement
                    .filter((ach : any) => (ach as {
                        achieved : number
                    }).achieved == 1);
                if (ach_arr.length > 0) {

                    all_ach_count += (ach_arr.length / all_arr.length) * 100;
                    game_with_ach_count += 1;

                }
                data_with_percent_etc.push({
                    ...ach,
                    percent: (ach_arr.length / all_arr.length) * 100,
                    gained: ach_arr.length,
                    all: all_arr.length
                });
                achiv_ach_count += ach_arr.length;
            }
        }
        localStorage.setItem("ach", JSON.stringify(data_with_percent_etc));
        setGames(data_with_percent_etc.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time).slice(0, 3));
        return [
            achiv_ach_count,
            (all_ach_count / game_with_ach_count).toFixed(2),
            game_with_ach_count
        ];
    }, [get_api]);
    function showClears() {
        const buttons = ["keyChangeButton", "keyClearButton", "steamIdChangeButton", "steamIdclearButton"]
        const button = document.getElementById("hideButton");
        button.style.display = "none";
        const div = document.getElementById("clearsButtons");
        div.style.display = "block";
        const checkDiv = document.getElementById("clearDiv");
        document.addEventListener('click', handleDocumentClick);
        function handleDocumentClick(event : any) {
            if (!checkDiv.contains(event.target) && !buttons.includes(event.target.id)) {
                div.style.display = 'none';
                button.style.display = "block";
                document.removeEventListener('click', handleDocumentClick);
            }
        };
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
        <div
            id="header key"
            style={{
            display: "flex",
            justifyContent: "space-between"
        }}>
            <div>
                <div
                    id="clearDiv"
                    style={{
                    width: 'fit-content',
                    height: 'fit-content'
                }}>
                    <button id="hideButton" className="ButtonToHide" onClick={showClears}>Buttons
                    </button>
                    <div id="clearsButtons" className="hiden">
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
                                    id="keyChangeButton"
                                    onClick={(event) => {
                                    setConstSteamWebApiKey(SteamWebApiKey);
                                    localStorage.setItem('api-key', SteamWebApiKey);
                                    update_user_data();
                                }}>Change key</button>
                            )}

                            {ConstSteamWebApiKey != "" && (
                                <button
                                    type="button"
                                    id="keyClearButton"
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
                                    type="button"
                                    id="steamIdChangeButton"
                                    onClick={(event) => {
                                    setConstSteamId(SteamId);
                                    localStorage.setItem('steamId', SteamId);
                                    update_user_data();
                                }}>Change steamID</button>
                            )}</div>

                        {ConstSteamId != "" && (
                            <button
                                type="button"
                                id="steamIdclearButton"
                                onClick={(event) => {
                                setConstSteamId("");
                                localStorage.setItem('steamId', "");
                            }}>Clear id</button>
                        )}
                    </div>
                </div>
                {personalName && (
                    <div>
                        <label color="#ffffff">{personalName}</label>
                        <br></br>
                        <img src={avaUrl}></img>
                        <br></br>
                        <label color="#ffffff">Achievements {Ach}</label>
                        <br></br>
                        <label color="#ffffff">Games {gamesCount}</label>

                        <br></br>
                        <button
                            onClick={() => {
                            const root = ReactDOM.createRoot(document.getElementById("root"));
                            root.render(<Games/>);
                        }}>Games with ach</button>
                        <button>All ach</button>
                        <br></br>
                        <div
                            style={{
                            marginTop: "1em",
                            marginLeft: "1em"
                        }}>
                            <ProgressRad data-progress={percent}/></div>
                    </div>
                )}</div>
            <div
                style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em"
            }}>
                {games.map((game) => (<GameCard game={game} backWindow="main"/>))}
            </div>
            <div id="container"></div>
        </div>
    )
}
import React, {useCallback, useEffect, useState} from "react";
export default function USER() {
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
            console.log(ret_data);
            return ret_data.json();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const calculateAchievementCount = useCallback(async(data_g_ach_url : string[]) => {
        const data = await get_api(data_g_ach_url);
        let achiv_ach_count = 0;
        let all_ach_count = 0;
        let game_with_ach_count = 0;
        localStorage.setItem("ach", JSON.stringify(data));
        for (let ach of data) {
            if (ach.playerAchievements) {
                let all_arr = ach.playerAchievements;
                let ach_arr = ach
                    .playerAchievements
                    .filter((ach : any) => (ach as {
                        achieved : number
                    }).achieved == 1);
                if (ach_arr.length > 0) {
                    console.log(ach_arr.length, all_arr.length);

                    all_ach_count += (ach_arr.length / all_arr.length) * 100;
                    game_with_ach_count += 1;

                }
                achiv_ach_count += ach_arr.length;
            }
        }
        return [
            achiv_ach_count,
            (all_ach_count / game_with_ach_count).toFixed(2),
            game_with_ach_count
        ];
    }, [get_api]);

    useEffect(useCallback(() => {
        try {
            const data_key = localStorage.getItem("api-key");
            const data_st_id = localStorage.getItem("steamId");
            if (data_key && data_st_id) {
                // Get the path to the user's data directory Create a filename for our data file
                const recent_game = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${data_key}&steamid=${data_st_id}&format=json`;
                const before = localStorage.getItem("recent");
                fetch(recent_game)
                    .then(response => response.json())
                    .then(data => {
                        let check = false;
                        console.log(before);
                        console.log(data);
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
                            const data_g_ach_url : string[] = [];
                            const data_games_res = fetch(url_games).then((response) => response.json()).then((data) => {
                                data_g_j = data;
                                setgamesCount(data_g_j.response.game_count);
                                if (data_g_j != undefined) {
                                    for (let ach in data_g_j.response.games) {
                                        data_g_ach_url.push(data_g_j.response.games[ach]['appid']);
                                        // выполнение операций на каждой итерации цикла
                                    }
                                    let ach = calculateAchievementCount(data_g_ach_url);
                                    ach.then((ach) => {
                                        setAch(ach[0].toString());
                                        setpercent(ach[1].toString());
                                    });
                                }
                            }).catch((error) => console.error(error));
                        } else {
                            setavaUrl(localStorage.getItem('ava'));
                            setpersonalName(localStorage.getItem('name'));
                            const ach = localStorage.getItem('ach');
                            const data = JSON.parse(ach);
                            setgamesCount(data.length);
                            let achiv_ach_count = 0;
                            let percent = 0;
                            let game_with_ach_count = 0;
                            for (let ach of data) {
                                if (ach.playerAchievements) {
                                    let ach_arr = ach
                                        .playerAchievements
                                        .filter((ach : any) => (ach as {
                                            achieved : number
                                        }).achieved == 1);
                                    let all_ach_arr = ach.playerAchievements;
                                    if (ach_arr.length > 0) {
                                        percent += ach_arr.length / all_ach_arr.length * 100;
                                        game_with_ach_count += 1;
                                    }
                                    achiv_ach_count += ach_arr.length;
                                }
                            }
                            setpercent((percent / game_with_ach_count).toFixed(2).toString())
                            setAch(achiv_ach_count.toString());

                        }
                    });
            }

        } catch (err) {
            window.alert(err.message);
        }
    }, []), []);
    return (
        <div id="header key">
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
                    <label color="#ffffff">Percent {percent}</label>
                    <br></br>
                </div>
            )}

        </div>
    )
}
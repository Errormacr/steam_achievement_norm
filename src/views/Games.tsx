import React, {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import App from "./main_window";

function rend_app() {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App/>);
}

function GameCard({game} : any) {
    return (
        <div
            style={{
            width: "400px",
            height: "230px",
            position: "relative"
        }}>
            <div
                style={{
                width: "400px",
                display: "flex"
            }}>
                <p
                    style={{
                    textAlign: "left",
                    marginLeft: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "240px",
                    wordWrap: "break-word",
                    maxWidth: "240px"
                }}>
                    {game.gameName}
                </p>
                <img
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_sm_120.jpg`}
                    style={{
                    float: "right",
                    height: "10%",
                    width: "30%",
                    marginRight: "10px",
                    marginTop: "6px"
                }}
                    alt={game.gameName}/></div>

            <div
                className="progress"
                style={{
                marginLeft: "3px",
                marginTop: "5px"
            }}>
                <div
                    className="progress-bar"
                    style={{
                    width: `${game.percent}%`,
                    backgroundColor: `${game.percent === 100
                        ? "#86e01e"
                        : game.percent >= 75
                            ? "#86e01e"
                            : game.percent >= 50
                                ? "#f2b01e"
                                : game.percent >= 25
                                    ? "#f27011"
                                    : "#f63a0f"}`
                }}></div>
            </div>

            <div className="card">
                <div className="rectangle left">{game.all}</div>
                <div className="rectangle middle">{game.gained}</div>
                <div className="rectangle right">{game.all - game.gained}</div>
            </div>
            <div
                className={game.percent === 100
                ? "full"
                : "not_full"}
                style={{
                backgroundColor: "gray",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "15px",
                zIndex: -1,
                backgroundSize: "cover"
            }}></div>
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "5px",
                marginLeft: "5px"
            }}>
                {game
                    .Achievement
                    .sort((a : any, b : any) => b.unlocktime - a.unlocktime)
                    .slice(0, 7)
                    .map((achivment : any) => (<img
                        className={achivment.percent <= 5
                        ? "rare1"
                        : achivment.percent <= 20
                            ? "rare2"
                            : achivment.percent <= 45
                                ? "rare3"
                                : achivment.percent <= 60
                                    ? "rare4"
                                    : "rare5"}
                        src={achivment.achieved
                        ? achivment.icon
                        : achivment.icongray}
                        alt="achievement image"
                        title={`${achivment.displayName}${achivment.description
                        ? "\n" + achivment.description
                        : ""}\n${achivment
                            .percent
                            .toFixed(2)} %\n${achivment
                            .unlocktime
                            ? new Date(achivment.unlocktime * 1000)
                            : ""}`}
                        style={{
                        width: "40px",
                        height: "40px",
                        filter: "none"
                    }}/>))}
            </div>
        </div>
    );
}

export default function Games() {
    const [Ach,
        setAch] = useState([]);
    function invert() {
        Ach.reverse();
        document
            .getElementById("game_container")
            .innerHTML = "";
        const gameCards = ReactDOM.createRoot(document.getElementById("game_container"));
        gameCards.render(Ach.map((game) => (<GameCard key={game.appid} game={game}/>)));

    };
    function change_sort() {
        document
            .getElementById("game_container")
            .innerHTML = "";
        const value = document
            .querySelector("select")
            .value;
        const ach = Ach;
        if (value === "0") {
            ach.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time);
            setAch(ach);
        } else if (value === "1") {
            ach.sort((a : any, b : any) => b.percent - a.percent);
            setAch(ach);
        } else if (value === "2") {
            ach.sort((a : any, b : any) => b.all - a.all);
            setAch(ach);
        } else if (value === "3") {
            ach.sort((a : any, b : any) => b.gained - a.gained);
            setAch(ach);
        } else if (value === "4") {
            ach.sort((a : any, b : any) => (b.all - b.gained) - (a.all - a.gained));
            setAch(ach);
        }
        const gameCards = ReactDOM.createRoot(document.getElementById("game_container"));
        gameCards.render(Ach.map((game) => (<GameCard key={game.appid} game={game}/>)));

    };
    useEffect(useCallback(() => {
        try {
            const ach = JSON.parse(localStorage.getItem("ach"));
            ach.sort((a : any, b : any) => b.last_launch_time - a.last_launch_time);
            console.log(ach);
            setAch(ach);
        } catch (error) {
            window.alert(error.message);
        }
    }, []), []);

    return (
        <div id="header key">
            <button onClick={rend_app}>return</button>
            <select required onChange={change_sort}>
                <option value="0">Last launch</option>
                <option value="1">Percent</option>
                <option value="2">All ach</option>
                <option value="3">Gained ach</option>
                <option value="4">Non gained ach</option>
            </select>
            <button onClick={invert}>Invert</button>
            <br/>
            <div
                id="game_container"
                style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap"
            }}>
                {Ach.map((game) => (<GameCard key={game.appid} game={game}/>))}
            </div>
        </div>
    );
}

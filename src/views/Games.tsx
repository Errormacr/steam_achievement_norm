import {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import App from "./main_window";
import GamePage from "./GamePage";
let root = ReactDOM.createRoot(document.getElementById("root"));

function rend_app() {
    root.render(<App/>);
}
export function UnixTimestampToDate(props : number) {
    const date = new Date(props * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
};

function logging(apiid : number, backWindow : string) {
    root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<GamePage appid={apiid} backWindow={backWindow}/>);
};
export function GameCard({game, backWindow} : any) {
    return (
        <div
            className={`card ${game.percent === 100
            ? "full"
            : "not_full"}`}
            all-ach={game.all}
            gained-ach={game.gained}
            non-gained-ach={game.all - game.gained}
            game-percent={game.percent}
            last-launch={game.last_launch_time}
            game-playtime={game.playtime}
            onClick={() => logging(game.appid, backWindow)}
            style={{
            width: "400px",
            height: "200px",
            borderRadius: "16px",
            position: "relative"
        }}>
            <div
                style={{
                width: "400px",
                height: "70px",
                display: "flex"
            }}>
                <p
                    style={{
                    color: "white",
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
                    height: "80%",
                    width: "40%",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5), 0 0 0 5px white inset",
                    marginRight: "20px",
                    marginTop: "6px"
                }}
                    alt={game.gameName}/></div>
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div
                    className="progress"
                    style={{
                    width: "94%"
                }}>
                    <div
                        className="progress-bar"
                        style={{
                        width: `${game.percent}%`,
                        backgroundColor: `${game.percent === 100
                            ? "#86e01e"
                            : game.percent >= 87.5
                                ? "#9cc31e"
                                : game.percent >= 75
                                    ? "#b6a51e"
                                    : game.percent >= 50
                                        ? "#f2b01e"
                                        : game.percent >= 25
                                            ? "#f27011"
                                            : "red"}`
                    }}></div>
                </div>
            </div>
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>

                <div className="row">
                    <div className="cell left" title="Все достижения">{game.all}</div>
                    <div className="cell middle" title="Полученные достижения">{game.gained}</div>
                    <div className="cell middle" title="Не полученные достижения">{game.all - game.gained}</div>
                    <div className="cell middle" title="Процент достижений">{game
                            .percent
                            .toFixed(2)}%</div>
                    <div className="cell middle" title="Последний запуск">{UnixTimestampToDate(game.last_launch_time) == "1970.1.1"
                            ? "No"
                            : UnixTimestampToDate(game.last_launch_time)}</div>
                    <div className="cell right" title="Время игры">{game.playtime + " часов"}</div>
                </div>
            </div>
            <div
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
                marginTop: "10px",
                marginLeft: "5px"
            }}>
                {game
                    .Achievement
                    .sort((a : any, b : any) => b.unlocktime - a.unlocktime)
                    .slice(0, 7)
                    .map((achivment : any) => (<img
                        key={achivment.name}
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
                            ? UnixTimestampToDate(achivment.unlocktime)
                            : ""}`}
                        style={{
                        width: "40px",
                        height: "40px"
                    }}/>))}
            </div>
        </div>
    );
}

export default function Games() {
    const [Ach,
        setAch] = useState([]);
    const [sortConfig,
        setSortConfig] = useState("last-launch");
    interface SortFunctions {
        [key : string] : (a : HTMLElement, b : HTMLElement) => number;
    }

    const sortFunctions : SortFunctions = {
        "last-launch": (a, b) => Number(b.getAttribute("last-launch")) - Number(a.getAttribute("last-launch")),
        "game-percent": (a, b) => Number(b.getAttribute("game-percent")) - Number(a.getAttribute("game-percent")),
        "all-ach": (a, b) => Number(b.getAttribute("all-ach")) - Number(a.getAttribute("all-ach")),
        "gained-ach": (a, b) => Number(b.getAttribute("gained-ach")) - Number(a.getAttribute("gained-ach")),
        "non-gained-ach": (a, b) => Number(b.getAttribute("non-gained-ach")) - Number(a.getAttribute("non-gained-ach")),
        "game-playtime": (a, b) => Number(b.getAttribute("game-playtime")) - Number(a.getAttribute("game-playtime")),
        "last-launchrev": (a, b) => Number(a.getAttribute("last-launch")) - Number(b.getAttribute("last-launch")),
        "game-percentrev": (a, b) => Number(a.getAttribute("game-percent")) - Number(b.getAttribute("game-percent")),
        "all-achrev": (a, b) => Number(a.getAttribute("all-ach")) - Number(b.getAttribute("all-ach")),
        "gained-achrev": (a, b) => Number(a.getAttribute("gained-ach")) - Number(b.getAttribute("gained-ach")),
        "non-gained-achrev": (a, b) => Number(a.getAttribute("non-gained-ach")) - Number(b.getAttribute("non-gained-ach")),
        "game-playtimerev": (a, b) => Number(a.getAttribute("game-playtime")) - Number(b.getAttribute("game-playtime"))
    };

    function sortGames(sort : string) {
        setSortConfig(sort);
        const container = document.getElementById("game_container");
        const elements = Array.from(container.children);
        elements.sort(sortFunctions[sort]);
        elements.forEach((element) => container.appendChild(element));
    }

    useEffect(useCallback(() => {
        try {
            root = ReactDOM.createRoot(document.getElementById("root"));
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
            <button
                className="gameButton"
                onClick={rend_app}
                style={{
                marginLeft: "10px",
                position: "absolute",
                width: "110px",
                left: "0",
                right: "0"
            }}>return</button>
            <div
                style={{
                background: "white",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50rem",
                height: "3rem",
                position: "absolute",
                right: "25%",
                top: "0",
                marginTop: "10px",
            }}>

                <div style={{
                    color: "black"
                }}>Sort by:
                </div>
                <button
                    className={`sortGamesButton ${sortConfig === 'last-launch'
                    ? 'active'
                    : sortConfig === 'last-launchrev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "last-launch"
                        ? "last-launchrev"
                        : "last-launch");
                }}>Last Launch {sortConfig === 'last-launch'
                        ? '\u25BC'
                        : sortConfig === 'last-launchrev'
                            ? "\u25B2"
                            : ""}</button>
                <button
                    className={`sortGamesButton ${sortConfig === 'game-percent'
                    ? 'active'
                    : sortConfig === 'game-percentrev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "game-percent"
                        ? "game-percentrev"
                        : "game-percent");
                }}>Percent {sortConfig === 'game-percent'
                        ? '\u25BC'
                        : sortConfig === 'game-percentrev'
                            ? "\u25B2"
                            : ""}</button>
                <button
                    className={`sortGamesButton ${sortConfig === 'all-ach'
                    ? 'active'
                    : sortConfig === 'all-achrev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "all-ach"
                        ? "all-achrev"
                        : "all-ach");
                }}>All ach {sortConfig === 'all-ach'
                        ? '\u25BC'
                        : sortConfig === 'all-achrev'
                            ? "\u25B2"
                            : ""}</button>
                <button
                    className={`sortGamesButton ${sortConfig === 'gained-ach'
                    ? 'active'
                    : sortConfig === 'gained-achrev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "gained-ach"
                        ? "gained-achrev"
                        : "gained-ach");
                }}>Gained ach {sortConfig === 'gained-ach'
                        ? '\u25BC'
                        : sortConfig === 'gained-achrev'
                            ? "\u25B2"
                            : ""}</button>
                <button
                    className={`sortGamesButton ${sortConfig === 'non-gained-ach'
                    ? 'active'
                    : sortConfig === 'non-gained-achrev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "non-gained-ach"
                        ? "non-gained-achrev"
                        : "non-gained-ach");
                }}>Non gained ach {sortConfig === 'non-gained-ach'
                        ? '\u25BC'
                        : sortConfig === 'non-gained-achrev'
                            ? "\u25B2"
                            : ""}</button>
                <button
                    className={`sortGamesButton ${sortConfig === 'game-playtime'
                    ? 'active'
                    : sortConfig === 'game-playtimerev'
                        ? "active"
                        : ""}`}
                    onClick={() => {
                    sortGames(sortConfig === "game-playtime"
                        ? "game-playtimerev"
                        : "game-playtime");
                }}>Playtime {sortConfig === 'game-playtime'
                        ? '\u25BC'
                        : sortConfig === 'game-playtimerev'
                            ? "\u25B2"
                            : ""}</button>
            </div>
            <br/>
            <div
                id="game_container"
                style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "3rem",
                gap: "10px",
                
                flexWrap: "wrap"
            }}>
                {Ach.map((game) => (<GameCard
                    style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5), 0 0 0 5px white inset"
                }}
                    key={game.appid}
                    window="games"
                    game={game}/>))}
            </div>
        </div>
    );
}

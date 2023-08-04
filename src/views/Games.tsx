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
export function GameCard({game,backWindow} : any) {
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
    function invert() {

        const gameCards = document.getElementById("game_container");
        const elements = Array.from(gameCards.children);
        elements.reverse()
        elements.forEach(element => gameCards.appendChild(element));

    };
    interface SortFunctions {
        [key : string] : (a : HTMLElement, b : HTMLElement) => number;
    }

    const sortFunctions : SortFunctions = {
        "last-launch": (a, b) => Number(b.getAttribute("last-launch")) - Number(a.getAttribute("last-launch")),
        "game-percent": (a, b) => Number(b.getAttribute("game-percent")) - Number(a.getAttribute("game-percent")),
        "all-ach": (a, b) => Number(b.getAttribute("all-ach")) - Number(a.getAttribute("all-ach")),
        "gained-ach": (a, b) => Number(b.getAttribute("gained-ach")) - Number(a.getAttribute("gained-ach")),
        "non-gained-ach": (a, b) => Number(b.getAttribute("non-gained-ach")) - Number(a.getAttribute("non-gained-ach")),
        "game-playtime": (a, b) => Number(b.getAttribute("game-playtime")) - Number(a.getAttribute("game-playtime"))
    };

    function sortGames() {
        const container = document.getElementById("game_container");
        const elements = Array.from(container.children);
        const value = document
            .querySelector("select")
            .value;
        elements.sort(sortFunctions[value]);
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
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <button
                    className="gameButton"
                    onClick={rend_app}
                    style={{
                    marginRight: "5px"
                }}>return</button>
                <select id="select_sort" required onChange={sortGames}>
                    <option value="last-launch">Last launch</option>
                    <option value="game-percent">Percent</option>
                    <option value="all-ach">All ach</option>
                    <option value="gained-ach">Gained ach</option>
                    <option value="non-gained-ach">Non gained ach</option>
                    <option value="game-playtime">Playtime</option>
                </select>
                <button
                    className="gameButton"
                    onClick={invert}
                    style={{
                    marginLeft: "5px"
                }}>Invert</button>
            </div>
            <br/>
            <div
                id="game_container"
                style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
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

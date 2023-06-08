import {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import Games, {UnixTimestampToDate} from "./Games";
import ProgressRad from "./rad_progress"
import Ach_cont from './last_ach_containter';

interface Game {
    appid : number;
    last_launch_time : number;
    playtime : string;
    gameName : string;
    Achievement : any[];
    all : number;
    gained : number;
    percent : number;
}
export default function GamePage({appid} : any) {
    const [game,
        setGame] = useState < Game > ({
        appid: 0,
        last_launch_time: 0,
        playtime: "",
        gameName: "",
        Achievement: [
            {}
        ],
        all: 0,
        gained: 0,
        percent: 0
    });

    useEffect(useCallback(() => {
        try {
            const games = JSON.parse(localStorage.getItem('ach'));
            const curGame = games.find((game : any) => game.appid === appid);
            setGame(curGame);
            console.log(curGame.Achievement[0].icon);
        } catch (error) {
            window.alert(error.message);
        }
    }, [appid]), []);

    return (
        <div>
            <button
                onClick={() => {
                const root = ReactDOM.createRoot(document.getElementById("root"));
                root.render(<Games/>);
            }}>return</button>
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <label
                    style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    fontSize: "2rem"
                }}>{game.gameName}</label>
            </div>
            <div
                style={{
                height: "10em",
                marginTop: "1em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <img
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`}
                    style={{
                    float: "left",
                    height: "90%",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5), 0 0 0 5px white inset",
                    marginRight: "20px"
                }}
                    alt={game.gameName}/>
                <ProgressRad data-progress={`${game.percent}`}/>

            </div>
            <div
                style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <table>
                    <tr>
                        <th></th>
                        <th>name</th>
                        <th>description</th>
                        <th>percent</th>
                        <th>date</th>
                    </tr>
                    {game
                        .Achievement.sort((a : any, b : any) => {
                            return (b.unlocktime - a.unlocktime)
                        })
                        .sort((a : any, b : any) => {
                            return (b.achieved - a.achieved)
                        })
                        .map((achivment : any) => (
                            <tr>
                                <td
                                    style={{
                                    width: "3em"
                                }}>
                                    <img
                                        style={{
                                        width: "2.5em"
                                    }}
                                        src={achivment.achieved
                                        ? achivment.icon
                                        : achivment.icongray}></img>
                                </td>
                                <td>{achivment.displayName}</td>
                                <td>{achivment.description}</td>
                                <td>{(parseFloat(achivment.percent)).toFixed(2)}
                                    %</td>
                                <td>{UnixTimestampToDate(achivment.unlocktime) == "1970.1.1"
                                        ? "-"
                                        : UnixTimestampToDate(achivment.unlocktime)}</td>
                            </tr>
                        ))}

                </table>
            </div>
        </div>
    );
}
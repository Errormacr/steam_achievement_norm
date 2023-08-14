import {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import Games from "./Games";
import ProgressRad from "./rad_progress"
import Table from './Table';
import App from "./main_window";

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
export default function GamePage({appid, backWindow}: any) {
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
    const [loaded,
        setLoaded] = useState(false);

    useEffect(useCallback(() => {
        try {
            const games = JSON.parse(localStorage.getItem('ach'));
            const curGame = games.find((game : any) => game.appid === appid);
            setGame(curGame);
            console.log(curGame.Achievement);
            setLoaded(true);
        } catch (error) {
            window.alert(error.message);
        }
    }, [appid]), []);

    return (
        <div>
            <button
                className="gameButton"
                onClick={() => {
                const root = ReactDOM.createRoot(document.getElementById("root"));
                if (backWindow =="main") {
                    root.render(<App/>);
                }
                else {
                root.render(<Games/>);}
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
                <label title="полученных из всех" style={{marginLeft:"2rem",
            fontSize:"2em"}}>{game.all - game.gained}/{game.all}</label>

            </div>
            <div
                style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {loaded && (<Table
                    data={[game
                    .Achievement
                    .sort((a : any, b : any) => {
                        return (b.unlocktime - a.unlocktime)
                    })
                    .sort((a : any, b : any) => {
                        return (b.achieved - a.achieved)
                    }),false]}
                    />)
}
            </div>
        </div>
    );
}
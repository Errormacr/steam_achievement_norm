import {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import Games from "./Games";
import ProgressRad from "./rad_progress";
import Table from "./Table";
import AchBox from "./AchContainer";
import App from "./main_window";
import {I18nextProvider, useTranslation} from "react-i18next";
import i18n from "i18next";
import ScrollToTopButton from "./ScrollToTopButton";
import GameButton from "./GameButton";
import "./scss/GamePage.scss";
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
export default function GamePage({appid, backWindow} : any) {
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
    const [tableOrBox,
        setTableOrBox] = useState(true);
    const {t} = useTranslation();

    useEffect(() => {
        try {
            const games = JSON.parse(localStorage.getItem("ach"));
            const curGame = games.find((game : any) => game.appid === appid);
            setGame(curGame);
            const boxView = localStorage.getItem("boxView") == 'true'
                ? true
                : false;
            if (!boxView) {
                setTableOrBox(false);
            }
            setLoaded(true);
        } catch (error) {
            window.alert(error.message);
        }
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <div>
                <ScrollToTopButton/>
                <GameButton
                    id=""
                    text={t("Return")}
                    onClick={() => {
                    const root = ReactDOM.createRoot(document.getElementById("root"));
                    if (backWindow == "main") {
                        root.render(<App/>);
                    } else {
                        root.render(<Games/>);
                    }
                }}/>
                <div className="label-container">
                    <label className="game-label">{game.gameName}</label>
                </div>
                <div className="label-container preview-container">
                    <img
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`}
                        className="preview-img"
                        alt={game.gameName}/>
                    <ProgressRad
                        data-progress={`${game.percent}`}
                        SizeVnu={"9rem"}
                        SizeVne={"10rem"}/>
                    <label title={t("GainedFromAll")} className="gain-nongain">
                        {game.gained}/{game.all}
                    </label>
                </div>
                <GameButton
                    id=""
                    text={t("SwitchTable")}
                    onClick={() => {
                    setTableOrBox(!tableOrBox);
                    localStorage.setItem("boxView", String(!tableOrBox));
                }}
                    additionalClass="switchTable"/>
                <div className="table-container">
                    {loaded && (tableOrBox
                        ? (<Table
                            data={{
                            achievements: game.Achievement,
                            allAch: false
                        }}/>)
                        : (<AchBox
                            data={[
                            game
                                .Achievement
                                .map((achiv) => {
                                    return {achivment: achiv, gameName: game.gameName};
                                }),
                            false
                        ]}/>))}
                </div>
            </div>
        </I18nextProvider>
    );
}

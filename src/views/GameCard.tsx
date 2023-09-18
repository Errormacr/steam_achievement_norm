import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from 'i18next';
import GamePage from "./GamePage";

export function UnixTimestampToDate(props : number) {
    const date = new Date(props * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
}

function logging(apiid : number, backWindow : string) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<GamePage appid={apiid} backWindow={backWindow}/>);
}

export function GameCard({game, backWindow} : any) {
    const {t} = useTranslation();
    const cardRef = useRef < HTMLDivElement > (null);
    const [isProgressBarAnimated,
        setIsProgressBarAnimated] = useState(false);

    useEffect(() => {
        const options : IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsProgressBarAnimated(true);
                }
            });
        }, options);

        // Start observing the element
        if (cardRef.current) {
            intersectionObserver.observe(cardRef.current);
        }

        // Clean up the observer
        return () => {
            if (cardRef.current) {
                intersectionObserver.unobserve(cardRef.current);
            }
        };
    }, []);

    const {
        appid,
        gameName,
        percent,
        all,
        gained,
        last_launch_time,
        playtime,
        Achievement
    } = game;

    return (
        <I18nextProvider i18n={i18n}>
            <div
                ref={cardRef}
                className={`card ${percent === 100
                ? "full"
                : "not_full"}`}
                all-ach={all}
                gained-ach={gained}
                non-gained-ach={all - gained}
                game-percent={percent}
                last-launch={UnixTimestampToDate(last_launch_time) === "1970.1.1"
                ? "No"
                : UnixTimestampToDate(last_launch_time)}
                game-playtime={`${playtime} часов`}
                key={appid}
                onClick={() => logging(appid, backWindow)}>
                <div className="name-preview">
                    <p className="name">
                        {gameName}
                    </p>
                    <img
                        className="preview"
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
                        alt={gameName}/>
                </div>
                <div className="progress-bar-container">
                    <div className="progress">
                        <div
                            className="progress-bar"
                            style={{
                            width: `${isProgressBarAnimated
                                ? percent
                                : 0}%`,
                            backgroundColor: `${percent === 100
                                ? "#86e01e"
                                : percent >= 87.5
                                    ? "#9cc31e"
                                    : percent >= 75
                                        ? "#b6a51e"
                                        : percent >= 50
                                            ? "#f2b01e"
                                            : percent >= 25
                                                ? "#f27011"
                                                : "red"}`
                        }}></div>
                    </div>
                </div>
                <div className="details-container">
                    <div className="row">
                        <div className="cell left" title={t("AllAChInGame")}>{all}</div>
                        <div className="cell middle" title={t("GainedAch")}>{gained}</div>
                        <div className="cell middle" title={t("NonGainedAch")}>{all - gained}</div>
                        <div className="cell middle" title={t("PercentAch")}>{percent.toFixed(2)}%</div>
                        <div className="cell middle" title={t("LastLaunch")}>{UnixTimestampToDate(last_launch_time) == "1970.1.1"
                                ? "No"
                                : UnixTimestampToDate(last_launch_time)}</div>
                        <div className="cell right" title={t("PlayTime")}>{playtime + " часов"}</div>
                    </div>
                </div>
                <div className="gameCard-background"></div>
                <div className="achievement-images">
                    {Achievement.sort((a : any, b : any) => b.unlocktime - a.unlocktime)
                        .slice(0, 7)
                        .map((achievement : any) => (<img
                            key={achievement.name}
                            className={`achievement-image ${achievement.percent <= 5
                            ? "rare1"
                            : achievement.percent <= 20
                                ? "rare2"
                                : achievement.percent <= 45
                                    ? "rare3"
                                    : achievement.percent <= 60
                                        ? "rare4"
                                        : "rare5"}`}
                            src={achievement.achieved
                            ? achievement.icon
                            : achievement.icongray}
                            alt="achievement image"
                            title={`${achievement.displayName}${achievement.description
                            ? "\n" + achievement.description
                            : ""}\n${achievement
                                .percent
                                .toFixed(2)} %\n${achievement
                                .unlocktime
                                ? UnixTimestampToDate(achievement.unlocktime)
                                : ""}`}/>))}
                </div>
            </div>
        </I18nextProvider>
    );
}

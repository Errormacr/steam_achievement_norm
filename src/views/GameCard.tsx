import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GamePage from './GamePage';
import './scss/GameCard.scss';

export function UnixTimestampToDate (props: number) {
  const date = new Date(props * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export interface Achievements {
  appid: number;
  name: string;
  hidden: number;
  icon: string;
  grayIcon: string;
  percent: number;
  steamID: string;
  unlocked: boolean;
  unlockedDate: Date;
  language: string;
  description: string;
  displayName: string;
}

function logging (appid: number, backWindow: string) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<GamePage appid={appid} backWindow={backWindow} />);
}

export function GameCard ({ game, backWindow }: any) {
  const [percent, setPercent] = useState(0.0);
  const [lastLaunchTime, setLastLaunchTime] = useState('');
  const [playtime, setPlaytime] = useState(0.0);
  const [all, setAll] = useState(0);
  const [gained, setGained] = useState(0);
  const [gameName, setGamename] = useState('');
  const [aches, setAches] = useState([]);

  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isProgressBarAnimated, setIsProgressBarAnimated] = useState(false);
  const updateGame = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameResponse = await fetch(`http://localhost:8888/api/user/${dataSteamId}/game/${game}/data?language=${i18n.language}`);
    const gameData = await gameResponse.json();
    setPercent(gameData.userDatas[0].percent);
    setAll(gameData.achievmentsFromView.length);
    setGained(gameData.userDatas[0].gainedAch);
    setPlaytime(gameData.userDatas[0].playtime.toFixed(2));
    setGamename(gameData.gamename);
    setLastLaunchTime(gameData.userDatas[0].lastLaunchTime);
    console.log(i18n.language);
    setAches(gameData.achievmentsFromView.sort((a:Achievements, b:Achievements) => new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()).slice(0, 7));
  }, []);
  useEffect(() => {
    updateGame();
    // eslint-disable-next-line no-undef
    const options: IntersectionObserverInit = {
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
  return (
    <I18nextProvider i18n={i18n}>
      <div
        ref={cardRef}
        className={`card ${percent === 100 ? 'full' : 'not_full'}`}
        all-ach={all}
        gained-ach={gained}
        non-gained-ach={all - gained}
        game-percent={percent}
        game-playtime={`${playtime} ${t('Hours')}`}
        key={game}
        onClick={() => { if (all)logging(game, backWindow); }}
      >
        <div className="name-preview">
          <p className="name">{gameName}</p>
          <img
            className="preview"
            src={`https://steamcdn-a.akamaihd.net/steam/apps/${game}/capsule_sm_120.jpg`}
            alt={gameName}
          />
        </div>
        <div className="details-container">
          <div className="row">
            <div className="cell left" title={t('AllAChInGame')}>
              {gained}/{all}
            </div>
            <div className="cell middle" title={t('PercentAch')}>
              {percent.toFixed(2)}%
            </div>
            <div className="cell middle" title={t('LastLaunch')}>
              {
                lastLaunchTime.substring(0, 10)}
            </div>
            <div className="cell right" title={t('PlayTime')}>
              {`${playtime} ` + t('Hours')}
            </div>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress">
            <div
              className="progress-bar"
              style={{
                width: `${isProgressBarAnimated ? percent : 0}%`,
                backgroundColor: `${
                  percent === 100
                    ? '#86e01e'
                    : percent >= 87.5
                    ? '#9cc31e'
                    : percent >= 75
                    ? '#b6a51e'
                    : percent >= 50
                    ? '#f2b01e'
                    : percent >= 25
                    ? '#f27011'
                    : 'red'
                }`
              }}
            ></div>
          </div>
        </div>
        <div className="gameCard-background"></div>
        <div className="achievement-images">
          {aches
            .map((achievement: Achievements) => (
              <img
              key={achievement.name}
                className={`achievement-image ${
                  achievement.percent <= 5
                    ? 'rare1'
                    : achievement.percent <= 20
                    ? 'rare2'
                    : achievement.percent <= 45
                    ? 'rare3'
                    : achievement.percent <= 60
                    ? 'rare4'
                    : 'rare5'
                }`}
                src={
                achievement.unlocked ? achievement.icon : achievement.grayIcon
                }
                alt="achievement image"
                title={`${achievement.displayName}${
                  achievement.description ? '\n' + achievement.description : ''
                }\n${achievement.percent.toFixed(2)} %\n${
                  achievement.unlockedDate
                    ? achievement.unlockedDate
                    : ''
                }`}
              />
            ))}
        </div>
      </div>
    </I18nextProvider>
  );
}

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';

import AchievementImage from './AchievementImage';
import { Achievements, AchievmentsFromView, gameDataWithAch, GamePageProps } from '../../interfaces';
import { ApiService } from '../../services/api.services';

import '../scss/GameCard.scss';
const percentToState = (percent:number) => {
  return percent === 100
      ? 'complete'
      : percent >= 87.5
          ? 'high'
          : percent >= 75
              ? 'medium-high'
              : percent >= 50
                  ? 'medium'
                  : percent >= 25
                      ? 'low'
                      : 'very-low'
}
const GameCard: React.FC<GamePageProps> = ({ appid, backWindow }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const [percent, setPercent] = useState(0.0);
  const [lastLaunchTime, setLastLaunchTime] = useState('');
  const [playtime, setPlaytime] = useState(0.0);
  const [all, setAll] = useState(0);
  const [gained, setGained] = useState(0);
  const [gameName, setGamename] = useState('');
  const [aches, setAches] = useState([]);
  const [isProgressBarAnimated, setIsProgressBarAnimated] = useState(false);

  const logging = (appid: number, backWindow: string) => {
    navigate(`/GamePage/${appid}/${backWindow}`);
  };

  const updateGame = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameData = await ApiService.get<gameDataWithAch>(
      `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}`
    );

    setPercent(gameData.userData[0].percent);
    setAll(gameData.achievmentsFromView.length);
    setGained(gameData.userData[0].gainedAch);
    setPlaytime(+gameData.userData[0].playtime.toFixed(2));
    setGamename(gameData.gamename);
    setLastLaunchTime(`${gameData.userData[0].lastLaunchTime}`);
    setAches(
      gameData.achievmentsFromView
        .sort((a: Achievements, b: Achievements) =>
          new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()
        )
        .slice(0, 7)
    );
  }, [appid]);

  useEffect(() => {
    updateGame();

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

    if (cardRef.current) {
      intersectionObserver.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        intersectionObserver.unobserve(cardRef.current);
      }
    };
  }, [updateGame]);

  return (
    <I18nextProvider i18n={i18n}>
      <div
          role={'button'}
          tabIndex={0}
        ref={cardRef}
        className={`card ${percent === 100 ? 'full' : 'not_full'}`}
        all-ach={all}
        gained-ach={gained}
        non-gained-ach={all - gained}
        game-percent={percent}
        game-playtime={`${playtime} ${t('Hours')}`}
        key={appid}
        onClick={() => logging(appid, backWindow)}
        onKeyPress={() => logging(appid, backWindow)}
      >
        <div className="name-preview">
          <p className="name">{gameName}</p>
          <img
            className="preview"
            src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
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
              {lastLaunchTime.substring(0, 10)}
            </div>
            <div className="cell right" title={t('PlayTime')}>
              {`${playtime} ${t('Hours')}`}
            </div>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress">
            <div
              className={`progress-bar ${
                  percentToState(percent)
              }`}
              style={{
                width: `${isProgressBarAnimated ? percent : 0}%`
              }}
            />
          </div>
        </div>
        <div className="gameCard-background" />
        <div className="achievement-images">
          {aches.map((achievement: AchievmentsFromView) => (
            <AchievementImage
              key={achievement.name}
              icon={achievement.unlocked ? achievement.icon : achievement.grayIcon}
              displayName={achievement.displayName}
              description={achievement.description}
              percent={achievement.percent}
              unlockedDate={achievement.unlockedDate}
              gameName={achievement.game?.gamename}
            />
          ))}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default GameCard;

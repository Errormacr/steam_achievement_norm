import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Games from './Games';
import ProgressRad from './rad_progress';
import Table from './Table';
import AchBox from './AchContainer';
import App from './main_window';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import ScrollToTopButton from './ScrollToTopButton';
import GameButton from './GameButton';
import './scss/GamePage.scss';
import { GamePageProps } from '../interfaces';
interface Game {
    appid : number;
    last_launch_time : string;
    playtime : number;
    gameName : string;
    all : number;
    gained : number;
    percent : number;
}

const GamePage : React.FC < GamePageProps > = ({ appid, backWindow }) => {
  const [game,
    setGame] = useState < Game >({
      appid: 0,
      last_launch_time: '',
      playtime: 0,
      gameName: '',
      all: 0,
      gained: 0,
      percent: 0
    });
  const [loaded,
    setLoaded] = useState(false);
  const [tableOrBox,
    setTableOrBox] = useState(true);
  const { t } = useTranslation();
  const renderComponent = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameResponse = await fetch(`http://localhost:8888/api/user/${dataSteamId}/game/${appid}/data?language=${i18n.language}&achievements=false`);
    const gameData = await gameResponse.json();
    const newGameData = {
      appid: appid,
      last_launch_time: gameData.userDatas[0].lastLaunchTime,
      playtime: gameData.userDatas[0].playtime,
      gameName: gameData.gamename,
      all: gameData.achievementCount,
      gained: gameData.userDatas[0].gainedAch,
      percent: gameData.userDatas[0].percent
    };
    setGame(newGameData);
  }, []);
  useEffect(() => {
    try {
      renderComponent();
      const boxView = localStorage.getItem('boxView') === 'true';
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
                    text={t('Return')}
                    onClick={() => {
                      const root = ReactDOM.createRoot(document.getElementById('root'));
                      if (backWindow === 'main') {
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
                        SizeVnu={'9rem'}
                        SizeVne={'10rem'}/>
                    <label title={t('GainedFromAll')} className="gain-nongain">
                        {game.gained}/{game.all}
                    </label>
                </div>
                <GameButton
                    id=""
                    text={t('SwitchTable')}
                    onClick={() => {
                      setTableOrBox(!tableOrBox);
                      localStorage.setItem('boxView', String(!tableOrBox));
                    }}
                    additionalClass="switchTable"/>
                <div className="table-container">
                    {loaded && (tableOrBox
                      ? (<Table appid={appid} all={false} />)
                      : (<AchBox appid={appid} all={false}/>))}
                </div>
            </div>
        </I18nextProvider>
  );
};

export default GamePage;

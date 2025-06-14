import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { GrUpdate } from 'react-icons/gr';
import i18n from 'i18next';

import ProgressRad from '../components/rad_progress';
import Table from '../components/Table';
import ScrollToTopButton from '../components/ScrollToTopButton';
import GameButton from '../components/GameButton';
import AchBox from '../features/AchContainer';
import { GameDataRow, gameDataWithAch } from '../../interfaces';
import { ApiService } from '../../services/api.services';

import '../scss/GamePage.scss';

interface Game {
  appid: number;
  last_launch_time: string;
  playtime: number;
  gameName: string;
  all: number;
  gained: number;
  percent: number;
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appid, backWindow } = useParams<{
    appid: string;
    backWindow: string;
  }>();

  const [game, setGame] = useState<Game>({
    appid: 0,
    last_launch_time: '',
    playtime: 0,
    gameName: '',
    all: 0,
    gained: 0,
    percent: 0
  });
  const [loaded, setLoaded] = useState(false);
  const [tableOrBox, setTableOrBox] = useState(true);

  const renderComponent = async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameData = await ApiService.get<gameDataWithAch>(
      `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}&achievements=false`
    );
    const userData = gameData.userData[0];
    const newGameData = {
      appid: +appid,
      last_launch_time: userData.lastLaunchTime,
      playtime: userData.playtime,
      gameName: gameData.gamename,
      all: gameData.achievementCount,
      gained: userData.gainedAch,
      percent: userData.percent
    };
    setGame(newGameData);
  };

  const fetchUpdatedGameData = async () => {
    const steamId = localStorage.getItem('steamId');
    const { unlockedCount: gained } = await ApiService.get<GameDataRow>(
      `steam-api/all-user-ach-data/${steamId}/game/${game.appid}?lang=${i18n.language}`
    );
    toast.success(`${t('GameUpdateSuccess')}\n${t('Gained')} ${gained - game.gained}`);
    await renderComponent();
  };

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
        <ToastContainer />
        <ScrollToTopButton />
        <FaArrowLeft
          className="button-icon return"
          onClick={() => {
            if (backWindow === 'main') {
              navigate('/');
            } else {
              navigate('/Games');
            }
          }}
          id="return"
        />
        <div className="label-container">
          <label className="game-label">{game.gameName}</label>
        </div>
        <div className="label-container preview-container">
          <img
            src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`}
            className="preview-img"
            alt={game.gameName}
          />
          <ProgressRad
            data-progress={`${game.percent}`}
            SizeVnu="9rem"
            SizeVne="10rem"
          />
          <label title={t('GainedFromAll')} className="gain-nongain">
            {game.gained}/{game.all}
          </label>
        </div>
        <div className="switchTable">
          <GrUpdate
            id=""
            className="button-icon update-button"
            onClick={fetchUpdatedGameData}
          />
          <GameButton
            id=""
            text={t('GameStats')}
            onClick={() => {
              navigate(`/Stats/${game.appid}`);
            }}
          />
          <GameButton
            id=""
            text={t('SwitchTable')}
            onClick={() => {
              setTableOrBox(!tableOrBox);
              localStorage.setItem('boxView', String(!tableOrBox));
            }}
          />
        </div>
        <div className="table-container">
          {loaded && (
            tableOrBox ? (
              <Table appid={+appid} all={false} />
            ) : (
              <AchBox minPercent={0} maxPercent={100} appid={+appid} all={false} />
            )
          )}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default GamePage;

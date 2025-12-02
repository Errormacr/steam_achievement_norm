import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { GameDataRow, GameDataWithAch } from '../types';
import { ApiService } from '../services/api.services';

interface Game {
  appid: number;
  last_launch_time: string;
  playtime: number;
  gameName: string;
  all: number;
  gained: number;
  percent: number;
}

export function useGameData () {
  const { t } = useTranslation();
  const { appid } = useParams<{ appid: string }>();
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

  const renderComponent = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameData = await ApiService.get<GameDataWithAch>(
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
  }, [appid]);

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
      setLoaded(true);
    } catch (error) {
      window.alert(error.message);
    }
  }, [renderComponent]);

  return { game, loaded, fetchUpdatedGameData };
}

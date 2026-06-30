import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { GameDataRow, GameDataWithAch } from '../types';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';

interface Game {
  appid: number;
  last_launch_time: string;
  playtime: number;
  gameName: string;
  all: number;
  gained: number;
  percent: number;
  headerUrl?: string | null;
}

export function useGameData () {
  const { t } = useTranslation();
  const { appid: appidParam } = useParams<{ appid: string }>();
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
      `user/${dataSteamId}/game/${appidParam}/data?language=${i18n.language}&achievements=false`
    );
    const userData = gameData.userData[0];
    const newGameData = {
      appid: +appidParam,
      last_launch_time: userData.lastLaunchTime,
      playtime: userData.playtime,
      gameName: gameData.gamename,
      all: gameData.achievementCount,
      gained: userData.gainedAch,
      percent: userData.percent,
      headerUrl: gameData.headerUrl
    };
    setGame(newGameData);
  }, [appidParam]);

  const fetchUpdatedGameData = useCallback(async () => {
    try {
      const steamId = localStorage.getItem('steamId');
      const response = await ApiService.get<GameDataRow | null>(
        `steam-api/all-user-ach-data/${steamId}/game/${appidParam}?lang=${i18n.language}`
      );

      if (response && response.unlockedCount !== undefined) {
        const gained = response.unlockedCount;
        toast.success(`${t('GameUpdateSuccess')}\n${t('Gained')} ${gained - game.gained}`);
      } else {
        toast.warn(t('noGames'));
      }

      await renderComponent();
    } catch (error) {
      logger.error('Error updating game data', error);
      toast.error(t('connectionError'));
    }
  }, [appidParam, game.gained, renderComponent, t]);

  useEffect(() => {
    let isMounted = true;

    const loadGame = async () => {
      setLoaded(false);

      try {
        await renderComponent();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        globalThis.alert(message);
      } finally {
        if (isMounted) {
          setLoaded(true);
        }
      }
    };

    loadGame();

    return () => {
      isMounted = false;
    };
  }, [renderComponent]);

  return { game, loaded, fetchUpdatedGameData };
}

import React, { useCallback, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '../styles/scss/LastAchContainer.scss';
import AchievementImage from '../components/AchievementImage';
import { AchievmentsFromView, Pagination } from '../types';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';

const LastAchContainer: React.FC = () => {
  const [allAch, setAllAch] = useState<AchievmentsFromView[]>([]);

  const renderWindow = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    if (!dataSteamId) {
      setAllAch([]);
      return;
    }

    try {
      // Go through ApiService so caching, error toasts and logging stay
      // consistent with every other screen.
      const data = await ApiService.get<Pagination<AchievmentsFromView>>(
        `user/${dataSteamId}/achievements?orderBy=unlockedDate&desc=1&language=${i18n.language}&unlocked=1&page=1&pageSize=36`
      );
      setAllAch(data?.rows ?? []);
    } catch (error) {
      logger.error('Failed to load last achievements', error);
      setAllAch([]);
    }
  }, []);

  useEffect(() => {
    void renderWindow();
  }, [renderWindow]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="last_ach_container">
        {allAch.map((ach) => {
          return (
            <AchievementImage
            key={`${ach.appid}-${ach.name}`}
            icon={ach.icon}
            displayName={ach.displayName}
            description={ach.description}
            percent={ach.percent}
            unlockedDate={ach.unlockedDate ? new Date(ach.unlockedDate) : null}
            gameName={ach.game?.gamename}
          />
          );
        })}
      </div>
    </I18nextProvider>
  );
};

export default LastAchContainer;

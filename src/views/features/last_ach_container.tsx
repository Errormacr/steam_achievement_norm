import React, { useCallback, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '../scss/LastAchContainer.scss';
import AchievementImage from '../components/AchievementImage';
import { AchievmentsFromView } from '../../interfaces';

const LastAchContainer: React.FC = () => {
  const [allAch, setAllAch] = useState<AchievmentsFromView[]>([]);

  const renderWindow = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const lastAch = await fetch(`http://localhost:8888/api/user/${dataSteamId}/achievements?orderBy=unlockedDate&desc=1&language=${i18n.language}&unlocked=1&page=1&pageSize=36`);
    const lastAchData = await lastAch.json();
    setAllAch(lastAchData.rows);
  }, []);

  useEffect(() => {
    renderWindow();
  }, [renderWindow]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="last_ach_container">
        {allAch.map((ach) => {
          return (
            <AchievementImage
              key={ach.name}
            name={ach.name}
            icon={ach.icon}
            displayName={ach.displayName}
            description={ach.description}
            percent={ach.percent}
            unlockedDate={ach.unlockedDate}
            gameName={ach.game?.gamename}
          />
          );
        })}
      </div>
    </I18nextProvider>
  );
};

export default LastAchContainer;

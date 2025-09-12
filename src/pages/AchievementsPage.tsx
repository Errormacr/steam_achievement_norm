import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';

import ScrollToTopButton from '../components/ScrollToTopButton';
import GameButton from '../components/GameButton';
import { useAchievementsPageData } from '../hooks/useAchievementsPageData';
import AchievementsDisplay from '../features/AchievementsDisplay';

const AchPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { minPercent, maxPercent, date, backWindow, gameAppid } = useParams<{
    minPercent?: string;
    maxPercent?: string;
    date?: string;
    backWindow?: string;
    gameAppid?: string;
  }>();

  const { tableOrBox, setTableOrBox, loaded, achCount } = useAchievementsPageData({
    minPercent,
    maxPercent,
    date,
    gameAppid
  });

  const handleToggleView = () => {
    const newTableView = !tableOrBox;
    setTableOrBox(newTableView);
    localStorage.setItem('boxView', String(newTableView));
  };

  const handleGoBack = () => {
    if (backWindow === 'Stats') {
      navigate(`/${backWindow}${gameAppid ? '/' + gameAppid : ''}`);
    } else {
      navigate('/');
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <ScrollToTopButton />
        <div className="label-container">
          <FaArrowLeft
            className="button-icon return"
            onClick={handleGoBack}
            id="return"
          />
          <label className="game-label">
            {achCount} {t('Ach')}
          </label>
          <GameButton
            id=""
            onClick={handleToggleView}
            additionalClass="switchTable"
            text={t('SwitchTable')}
          />
        </div>
        <div className="details-container table-container">
          {loaded && (
            <AchievementsDisplay
              tableOrBox={tableOrBox}
              minPercent={+minPercent}
              maxPercent={+maxPercent}
              date={date === 'undefined' ? undefined : date}
              appid={Number(gameAppid) || undefined}
              unlocked={true}
              all={!+gameAppid}
            />
          )}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default AchPage;

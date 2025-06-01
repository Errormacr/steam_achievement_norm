import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameButton from './GameButton';
import ChangeAccount from '../pages/changeAccount';
import Settings from '../pages/Settings';
import ChangeKey from '../features/ChangeKey';
import UpdateUserData from '../features/UpdateUserData';
import '../scss/Header.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">

          <GameButton
            id=""
            additionalClass="header-button"
            onClick={() => navigate('/Games')}
            text={t('Games')}
          />
          <GameButton
            id=""
            additionalClass="header-button"
            onClick={() => navigate('/Achievements/0/100/undefined/main/undefined')}
            text={t('AllAch')}
          />
           <GameButton
            id=""
            additionalClass="header-button"
            onClick={() => navigate('/Achievements/0/100/undefined/main/undefined')}
            text={t('GameStats')}
          />
          <GameButton
            id=""
            additionalClass="header-button"
            onClick={() => navigate('/')}
            text={t('Profile')}
          />
            <ChangeAccount updatePage={() => {}} />
            <ChangeKey />
        </div>
        <div className="header-right">
            <UpdateUserData key="updateUserData" rerender={() => {}} />
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Header;

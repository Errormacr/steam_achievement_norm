import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameButton from './GameButton';
import ChangeAccount from '../pages/changeAccount';
import Settings from '../pages/Settings';
import ChangeKey from '../features/ChangeKey';
import UpdateUserData from '../features/UpdateUserData';
import '../styles/scss/Header.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRerender = () => {
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <GameButton
              id=""
              additionalClass="header-button"
              onClick={() => navigate('/')}
              text={t('Profile')}
          />
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
            onClick={() => navigate('/Stats/undefined')}
            text={t('GameStats')}
          />
            <ChangeAccount updatePage={handleRerender} />
            <ChangeKey />
        </div>
        <div className="header-right">
            <UpdateUserData key="updateUserData" rerender={handleRerender} />
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Header;

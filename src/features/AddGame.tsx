import React, { useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from '../components/GameButton';
import IdKeyInput from '../components/IdKeyInput';
import { ApiService } from '../services/api.services';
import '../styles/scss/AddGame.scss';
import { Percent } from '../types';
import { toast, ToastContainer } from 'react-toastify';
import { useModal } from '../hooks/useModal';
import { useGameSearch } from '../hooks/useGameSearch';

export default function AddGame (): React.JSX.Element {
  const { isOpen, openModal, closeModal } = useModal();
  const [appid, setAppid] = useState('');
  const { gamename } = useGameSearch(appid);

  const { t } = useTranslation();

  const OnUpdateKeyField = (val: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAppid(val.target.value);
  };

  const addGame = async () => {
    if (appid && gamename) {
      try {
        const steamId = localStorage.getItem('steamId');
        const res = await ApiService.put<Percent>(
          `user/${steamId}/game/${appid}/add-not-shown?lang=${i18n.language}`,
          {}
        );
        toast.success(`+${res.change.toFixed(2)}% ${t('averageUp')}`);
        closeModal();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <ToastContainer />
      <GameButton
        additionalClass="add-game-button"
        onClick={openModal}
        id="add-game-button"
        text={t('AddGame')}
      />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="settingsHeader">{t('addGameHeading')}</h2>
            <IdKeyInput onChange={OnUpdateKeyField} placeholder={'appid'} />
            {gamename && (
              <button onClick={addGame} className="find-game-card">
                <img
                  alt={gamename}
                  src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
                ></img>
                <p>{gamename}</p>
              </button>
            )}
          </div>
        </div>
      )}
    </I18nextProvider>
  );
}

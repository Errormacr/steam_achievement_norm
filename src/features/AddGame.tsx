import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from '../components/GameButton';
import IdKeyInput from '../components/IdKeyInput';
import { ApiService } from '../services/api.services';
import '../styles/scss/AddGame.scss';
import { Game, Percent } from '../interfaces';
import { toast, ToastContainer } from 'react-toastify';
import { useDebouncyEffect } from 'use-debouncy';
export default function AddGame (): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [appid, setAppid] = useState('');
  const [gamename, setGamename] = useState('');
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.modal-content')) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const OnUpdateKeyField = (val: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAppid(val.target.value);
  };

  useDebouncyEffect(() => getGame(appid), 1000, [appid]);

  const getGame = (appid: string) => {
    ApiService.get<Game>(`steam-api/game-by-appid/${appid}`)
      .then((game) => {
        if (game) {
          setGamename(game.gamename);
        }
      })
      .catch((error) => {
        setGamename('');
        toast.error(error.message);
      });
  };

  const addGame = async () => {
    if (appid && gamename) {
      try {
        const steamId = localStorage.getItem('steamId');
        const res = await ApiService.put<Percent>(
          `user/${steamId}/game/${appid}/add-not-shown?lang=${i18n.language}`,
          {}
        );
        toast.success('+ ' + res.change.toFixed(2) + '% ' + t('averageUp'));
        closeModal();
      } catch (error) {
        console.log(error.message);
        toast.error(error);
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
              <div onClick={addGame} className="find-game-card">
                <img
                  alt={`${gamename}`}
                  src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
                ></img>
                <p>{gamename}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </I18nextProvider>
  );
}

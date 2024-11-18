import React, { useState, useEffect, useRef } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import ProgressRad from './rad_progress';
import { Percent } from '../interfaces/games';

export default function UpdateUserData ({ rerender }: { rerender: () => void }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [gameCount, setGameCount] = useState(0);
  const [finishedGameCount, setFinishedGameCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const { t } = useTranslation();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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

  useEffect(() => {
    const socket = io('http://localhost:8888');

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      setIsConnected(false);
    });

    socket.on('gameCount', (data) => {
      console.log(data);
      if (data.count === 0) {
        toast.warn(t('noGames'));
      }
      setGameCount(data.count);
    });

    socket.on('updateGame', (data) => {
      console.log(data);
      setFinishedGameCount((prev) => prev + 1);
    });

    socket.on('status', (data) => {
      console.log(data);
      setFinishedGameCount(0);
      rerender();
      setGameCount(0);
      closeModal();
    });

    socket.on('change', (data: Percent) => {
      console.log(data);
      toast.success('+ ' + data.change.toFixed(2) + '% ' + t('averageUp'));
    });
  }, []);

  useEffect(() => {
    const updated = sessionStorage.getItem('updated');
    if (!updated && isConnected) {
      sessionStorage.setItem('updated', 'true');
      update('recent');
    }
  }, [isConnected]);

  const update = async (type: string) => {
    if (socketRef.current) {
      const steamId = localStorage.getItem('steamId');
      const language = i18n.language;
      const data = { steamId, language };
      if (type === 'ach-percentage') {
        socketRef.current.emit(type, { steamId });
      } else {
        socketRef.current.emit(type, data);
      }
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <GameButton
        id=""
        additionalClass="update-button"
        onClick={openModal}
        text={t('Update')}
      />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="settingsHeader">{t('updateUserDataHeading')}</h2>
            <div className="update-buttons">
              <GameButton id="update-recent" onClick={() => update('recent')} text={t('updateRecent')} />
              <GameButton id="update-played-owned" onClick={() => update('owned-played')} text={t('updatePlayedOwned')} />
              <GameButton id="update-all" onClick={() => update('all')} text={t('updateAll')} />
              <GameButton id="update-all-force" onClick={() => update('all-force')} text={t('updateAllForce')} />
              <GameButton id="update-percent-ach" onClick={() => update('ach-percentage')} text={t('updatePercentAch')} />
            </div>
          </div>
        </div>
      )}
      {gameCount > 0 && (
        <div className="modal">
          <ProgressRad
            title={t('updateProgress')}
            data-progress={`${(finishedGameCount / gameCount) * 100}`}
            SizeVnu="9rem"
            SizeVne="10rem"
          />
        </div>
      )}
    </I18nextProvider>
  );
}

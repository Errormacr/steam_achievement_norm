import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from '../components/GameButton';
import { toast } from 'react-toastify';
import { Percent } from '../../interfaces';
import { useSocket } from './SocketProvider';
import { GrUpdate } from 'react-icons/gr';
import UpdateProgress from './UpdateGameProgress';
export default function UpdateUserData ({
  rerender
}: {
  rerender: () => void;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useSocket();
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
    if (!socket) {
      return;
    }
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleStatus = () => {
      rerender();
      document.getElementById('updateProgress').style.display = 'none';
      closeModal();
    };

    const handleChange = (data: Percent) => {
      toast.success(`+ ${data.change.toFixed(2)}% ${t('averageUp')}`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('status', handleStatus);
    socket.on('change', handleChange);
    socket.on('close', handleDisconnect);
    socket.connect();
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('status', handleStatus);
      socket.off('change', handleChange);
      socket.disconnect();
    };
  }, [socket, rerender, t]);

  useEffect(() => {
    const updated = sessionStorage.getItem('updated');
    if (!updated && isConnected) {
      sessionStorage.setItem('updated', 'true');
      update('recent');
    }
  }, [isConnected]);

  const update = async (type: string) => {
    if (socket) {
      const modal = document.getElementById('updateProgress');
      modal.style.display = 'flex';
      const steamId = localStorage.getItem('steamId');
      const language = i18n.language;
      const data = { steamId, language };
      if (type === 'ach-percentage') {
        socket.emit(type, { steamId });
      } else {
        socket.emit(type, data);
      }
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <GrUpdate
        id=""
        className="button-icon update-button"
        onClick={openModal}
      />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="settingsHeader">{t('updateUserDataHeading')}</h2>
            <div className="update-buttons">
              <GameButton
                id="update-recent"
                onClick={() => update('recent')}
                text={t('updateRecent')}
              />
              <GameButton
                id="update-played-owned"
                onClick={() => update('owned-played')}
                text={t('updatePlayedOwned')}
              />
              <GameButton
                id="update-all"
                onClick={() => update('all')}
                text={t('updateAll')}
              />
              <GameButton
                id="update-all-force"
                onClick={() => update('all-force')}
                text={t('updateAllForce')}
              />
              <GameButton
                id="update-percent-ach"
                onClick={() => update('ach-percentage')}
                text={t('updatePercentAch')}
              />
            </div>
          </div>
        </div>
      )}

        <div id={'updateProgress'} className={'modal'} style={{ display: 'none' }}>
          <UpdateProgress socket={socket}></UpdateProgress>
        </div>

    </I18nextProvider>
  );
}

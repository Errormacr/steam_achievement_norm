import React, { useEffect, useRef, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { FaTrash } from 'react-icons/fa';

import GameButton from '../components/GameButton';
import IdKeyInput from '../components/IdKeyInput';
import { useDebounce } from '../hooks/useDebounce';
import { ApiService } from '../services/api.services';
import { User, UserData, ApiResponse } from '../types';
import { logger } from '../utils/logger';
import {
  getSteamIdValidationErrorKey,
  isSteamIdLookupValue
} from './changeAccount.helpers';

export default function ChangeAccount ({ updatePage }: Readonly<{ updatePage: () => void }>): React.JSX.Element {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [addingAcc, setAddingAcc] = useState(false);
  const [steamId, setSteamId] = useState('');
  const [writingSteamId, setWritingSteamId] = useState('');
  const [steamIdError, setSteamIdError] = useState('');
  const [accFound, setAccFound] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccAva, setNewAccAva] = useState('');
  const [accounts, setAccounts] = useState<User[]>([]);
  const debouncedSteamId = useDebounce(steamId, 500);
  const lookupRequestIdRef = useRef(0);

  const resetFoundAccount = () => {
    setAccFound(false);
    setNewAccName('');
    setNewAccAva('');
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAddingAcc(false);
    setSteamId('');
    setWritingSteamId('');
    setSteamIdError('');
    resetFoundAccount();
  };

  const getExistingUser = async () => {
    try {
      const users = await ApiService.get<User[]>('user');
      setAccounts(users);
    } catch (error) {
      logger.error('Error fetching existing users', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.modal-content')) {
        closeModal();
      }
    };

    void getExistingUser();
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const update = (nextSteamId: string) => {
    void ApiService.put<ApiResponse>(`user/${nextSteamId}/all-force?lang=${i18n.language}`);
  };

  useEffect(() => {
    if (!addingAcc || !isSteamIdLookupValue(debouncedSteamId)) {
      return;
    }

    let isCancelled = false;
    const requestId = lookupRequestIdRef.current + 1;
    lookupRequestIdRef.current = requestId;

    const lookupAccount = async () => {
      try {
        const { user } = await ApiService.get<UserData>(`user/${debouncedSteamId}/data`);

        if (isCancelled || requestId !== lookupRequestIdRef.current) {
          return;
        }

        setNewAccName(user.nickname);
        setNewAccAva(user.avatarMedium);
        setAccFound(true);
        setSteamIdError('');
      } catch (error) {
        if (isCancelled || requestId !== lookupRequestIdRef.current) {
          return;
        }

        resetFoundAccount();
        setSteamIdError(t('AccNotFound'));
        logger.error('Error fetching user data', error);
      }
    };

    void lookupAccount();

    return () => {
      isCancelled = true;
    };
  }, [addingAcc, debouncedSteamId, t]);

  const deleteUser = async (userId: string) => {
    try {
      await ApiService.delete<ApiResponse>(`user/${userId}`);
      setAccounts((prev) => prev.filter((acc) => acc.steamID !== userId));
    } catch (error) {
      logger.error('Error deleting user', error);
    }
  };

  const handleSteamIdChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    const validationErrorKey = getSteamIdValidationErrorKey(value);

    setWritingSteamId(value);
    resetFoundAccount();

    if (validationErrorKey) {
      setSteamId('');
      setSteamIdError(t(validationErrorKey));
      return;
    }

    setSteamId(value);
    setSteamIdError('');
  };

  return (
    <I18nextProvider i18n={i18n}>
      <GameButton id="" additionalClass="" onClick={openModal} text={t('changeAcc')} />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="settingsHeader">{t('chAccHeading')}</h2>
            <div className="accContainer">
              {[...accounts]
                .sort((a, b) => +a.steamID - +b.steamID)
                .map((account) => (
                  <button
                    key={account.steamID}
                    className="userContainer"
                    onClick={() => {
                      localStorage.setItem('steamId', account.steamID);
                      updatePage();
                      closeModal();
                    }}
                  >
                    <img alt="avatar" src={account.avatarMedium} />
                    <p style={{ marginBlock: '0' }}>{account.nickname}</p>
                    <FaTrash
                      className="deleteIcon"
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteUser(account.steamID);
                      }}
                    />
                  </button>
                ))}
            </div>
            {!addingAcc && (
              <GameButton
                id=""
                additionalClass="addAccButton"
                onClick={() => setAddingAcc(true)}
                text={t('addAcc')}
              />
            )}
            {addingAcc && (
              <IdKeyInput
                value={writingSteamId}
                onChange={handleSteamIdChange}
                placeholder="Steam id"
              />
            )}
            {steamIdError && addingAcc && <div className="input-error">{steamIdError}</div>}
            {accFound && addingAcc && (
              <div>
                <button
                  className="userContainer"
                  onClick={() => {
                    localStorage.setItem('steamId', steamId);
                    update(steamId);
                    updatePage();
                    closeModal();
                  }}
                >
                  <img alt="found user avatar" src={newAccAva} />
                  <p>{newAccName}</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </I18nextProvider>
  );
}

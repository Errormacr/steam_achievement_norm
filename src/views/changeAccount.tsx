import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import IdKeyInput from './IdKeyInput';
import { ApiService } from '../services/api.services';
import { User, UserData } from '../interfaces';
import { FaTrash } from 'react-icons/fa';

export default function ChangeAccount ({ updatePage } : {
    updatePage: () => Promise < void >
}) : React.JSX.Element {
  const [isOpen,
    setIsOpen] = useState(false);
  const [addingAcc,
    setAddingAcc] = useState(false);
  const [SteamId,
    setSteamId] = useState('');
  const [writingSteamId,
    setWritingSteamId] = useState('');
  const [steamIdError,
    setSteamIdError] = useState('');
  const [accFound,
    setAccFound] = useState(false);
  const [newAccName,
    setNewAccName] = useState('');
  const [newAccAva,
    setNewAccAva] = useState('');
  const [accounts,
    setAccounts] = useState < User[] >([]);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();
  const getExistingUser = async () => {
    const users = await ApiService.get < User[] >('user');
    setAccounts(users);
  };
  useEffect(() => {
    const handleOutsideClick = (event : MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.modal-content')) {
        closeModal();
        setAddingAcc(false);
      }
    };
    getExistingUser();
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const update = (steamId : string) => {
    ApiService.put(`user/${steamId}/all-force?lang=${i18n.language}`);
  };

  const fetchData = async (steamId : string) => {
    try {
      const { user } = await ApiService.get < UserData >(`user/${steamId}/data`);
      const personalName = user.nickname;
      const avaUrl = user.avatarMedium;
      setNewAccName(personalName);
      setNewAccAva(avaUrl);
      setAccFound(true);
    } catch (error) {
      setAccFound(false);

      setSteamIdError(SteamId !== ''
        ? t('AccNotFound')
        : '');
      console.error('Ошибка при получении данных:', error);
    }
  };
  const deleteUser = (userId : string) => {
    ApiService.delete(`user/${userId}`);
    setAccounts((prev) => prev.filter((acc) => acc.steamID !== userId));
  };
  return (
        <I18nextProvider i18n={i18n}>
            <GameButton id='' additionalClass='' onClick={openModal} text={t('changeAcc')}/> {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='settingsHeader'>{t('chAccHeading')}</h2>
                        <div className='accContainer'>
                            {accounts.sort((a, b) => +a.steamID - +b.steamID).map(account => <div
                                className="userContainer"
                                onClick={() => {
                                  localStorage.setItem('steamId', account.steamID);
                                  updatePage();
                                  closeModal();
                                }}>
                                <img src={account.avatarMedium}/>
                                <p
                                    style={{
                                      marginBlock: '0'
                                    }}>{account.nickname}</p>
                                <FaTrash
                                    className="deleteIcon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteUser(account.steamID);
                                    }}/>
                            </div>)}
                        </div>
                        {!addingAcc && <GameButton
                            id=''
                            additionalClass='addAccButton'
                            onClick={() => setAddingAcc(true)}
                            text={t('addAcc')}/>}
                        {addingAcc && <IdKeyInput
                            value={writingSteamId}
                            onChange={(event : {
                            target: {
                                value: string
                            }
                        }) => {
                              const value = event.target.value;
                              const regex = /^[0-9]+$/;
                              if (value !== '' && regex.test(value)) {
                                setSteamId(value);
                                fetchData(value);
                                setSteamIdError('');
                              } else if (value === '') {
                                setSteamIdError(t('SteamIdRequired'));
                              } else {
                                setSteamIdError(t('SteamIdError'));
                              }
                              setWritingSteamId(value);
                            }}
                            placeholder="Steam id"/>}
                        {steamIdError && addingAcc && <div className="input-error">{steamIdError}</div>}
                        {accFound && addingAcc && <div>
                            <div
                                className="userContainer"
                                onClick={() => {
                                  localStorage.setItem('steamId', SteamId);
                                  update(SteamId);
                                  updatePage();
                                  closeModal();
                                }}>
                                <img src={newAccAva}/>
                                <p >{newAccName}</p>

                            </div>
                        </div>}
                    </div>
                </div>
            )}
        </I18nextProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import IdKeyInput from './IdKeyInput';

export default function ChangeAccount () {
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
    setAccounts] = useState([]);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();

  useEffect(() => {
    const handleOutsideClick = (event : MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.modal-content')) {
        closeModal();
        setAddingAcc(false);
      }
    };
    const storedIdSet = new Set(JSON.parse(localStorage.getItem('idArray')) || []);
    if (storedIdSet.size > 0 && isOpen) {
      const steamIdsArray = Array.from(storedIdSet);
      const steamIdsString = JSON
        .stringify(steamIdsArray)
        .replace(/"/g, '');

      console.log(`http://localhost:4500/player_sum?key=${dataKey}&id=${steamIdsString}`);

      fetch(`http://localhost:4500/player_sum?key=${dataKey}&id=${steamIdsString}`)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          const playersArray = result
            .response
            .players
            .map((player : any) => ({ nickname: player.personaname, ava: player.avatarfull, steamId: player.steamid }));
          setAccounts(playersArray);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const dataKey = localStorage.getItem('api-key');
      const response = await fetch(`http://localhost:4500/player_sum?key=${dataKey}&id=${SteamId}`);
      const newData = await response.json();

      const personalName = newData.response.players[0].personaname;
      const avaUrl = newData.response.players[0].avatarfull;
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

  const handleAddAccount = (steamId : string) => {
    const storedIdSet = new Set(JSON.parse(localStorage.getItem('idArray')) || new Set());
    storedIdSet.add(steamId);
    localStorage.setItem('idArray', JSON.stringify(Array.from(storedIdSet)));
  };
  return (
        <I18nextProvider i18n={i18n}>
            <GameButton id='' additionalClass='' onClick={openModal} text={t('changeAcc')}/> {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='settingsHeader'>{t('chAccHeading')}</h2>
                        <div className='accContainer'>
                            {accounts.sort((a, b) => a.steamId - b.steamId).map(account => <div
                                className="userContainer"

                                onClick={() => {
                                  localStorage.setItem('steamId', account.steamId);
                                  update();
                                  closeModal();
                                }}>
                                <img
                                    style={{
                                      width: '4.5rem',
                                      height: '4.5rem'
                                    }}
                                    src={account.ava}/>
                                <p
                                    style={{
                                      marginBlock: '0'
                                    }}>{account.nickname}</p>
                            </div>)}

                        </div>
                        {!addingAcc && <GameButton
                            id=''
                            additionalClass='addAccButton'
                            onClick={() => setAddingAcc(true)}
                            text={t('addAcc')}/>}
                        {addingAcc && <IdKeyInput
                            value={writingSteamId}
                            onChange={(event) => {
                              const value = event.target.value;
                              const regex = /^[0-9]+$/;
                              if (value !== '' && regex.test(value)) {
                                setSteamId(value);
                                fetchData();
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
                            <div className="userContainer">
                                <img src={newAccAva}/>
                                <p >{newAccName}</p>

                            </div>
                            <GameButton
                                id=''
                                additionalClass='addAccButton'
                                onClick={() => handleAddAccount(SteamId)}
                                text={t('addAcc')}/></div>}
                    </div>
                </div>
            )}
        </I18nextProvider>
  );
}

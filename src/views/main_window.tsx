import React, { useCallback, useEffect, useState } from 'react';
import AchCont from './last_ach_container';
import ReactDOM from 'react-dom/client';
import Games from './Games';
import { GameCard } from './GameCard';
import ProgressRad from './rad_progress';
import AchPage from './AchievementsPage';
import ChangeAccount from './changeAccount';
import Settings from './Settings';
import LoadingOverlay from 'react-loading-overlay-ts';
import BounceLoader from 'react-spinners/BounceLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider, useTranslation } from 'react-i18next';
import IdKeyInput from './IdKeyInput';
import GameButton from './GameButton';
import i18n from '../transate';
import './scss/MainWindow.scss';
import Diagram from './AchDiagram';

export default function App () {
  const [SteamWebApiKey,
    setSteamWebApiKey] = useState('');
  const [ConstSteamWebApiKey,
    setConstSteamWebApiKey] = useState('');
  const [personalName,
    setPersonalName] = useState('');
  const [AchCount,
    setAchCount] = useState('');
  const [gamesCount,
    setGamesCount] = useState('');
  const [avaUrl,
    setAvaUrl] = useState('');
  const [percent,
    setPercent] = useState('');
  const [needToUpdate, setNeedToUpdate] = useState(true);

  const [apiKeyError,
    setApiKeyError] = useState('');
  const { t } = useTranslation();
  const updateRecent = useCallback(async () => {
    
  }, []);
  const updateUserData = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const achContainer = ReactDOM.createRoot(document.getElementById('container'));

    if (dataSteamId) {
      try {
        const userDataResponse = await fetch(`http://localhost:8888/user/${dataSteamId}/data`);
        const userData = await userDataResponse.json();
        setPersonalName(userData.nickname);
        setAvaUrl(userData.avatarLarge);
        setPercent(userData.percent);
        achContainer.render(<AchCont/>);
        toast.success('+ ' + (parseFloat(ach[1].toString()) - parseFloat(predPercent)).toFixed(2).toString() + '% ' + t('averageUp'));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleKeyChange = () => {
    setConstSteamWebApiKey(SteamWebApiKey);
    setNeedToUpdate(true)
    
    updateUserData();
  };
  const handleKeyClear = () => {
    setConstSteamWebApiKey('');
    localStorage.setItem('api-key', '');
  };
  const handleUpdate = () => {
    localStorage.setItem('recent', '');
    updateUserData();
  };
  function showClears () {
    const buttons = ['keyChangeButton', 'keyClearButton', 'steamIdChangeButton', 'steamIdClearButton'];
    const button = document.getElementById('hideButton');
    const div = document.getElementById('clearsButtons');
    const checkDiv = document.getElementById('clearDiv');

    button.style.display = 'none';
    div.style.display = 'flex';
    checkDiv.style.justifyContent = 'center';

    function handleDocumentClick (event : any) {
      if (!checkDiv.contains(event.target) && !buttons.includes(event.target.id)) {
        div.style.display = 'none';
        checkDiv.style.justifyContent = 'space-between';
        button.style.display = 'block';
        document.removeEventListener('click', handleDocumentClick);
      }
    }

    document.addEventListener('click', handleDocumentClick);
  }
  useEffect(useCallback(() => {
    try {
      const data = localStorage.getItem('api-key');
      if (data !== undefined) {
        setConstSteamWebApiKey(data);
      }
      updateUserData();
    } catch (error) {
      window.alert(error.message);
    }
  }, []), []);

  return (
        <I18nextProvider i18n={i18n}>
            <div>

                    <div id="header key" className="header">
                        <div>
                            <div id="clearDiv" className="clearDiv">
                                <GameButton
                                    id='hideButton'
                                    additionalClass="ButtonToHide"
                                    text={t('changeIdKeyButton')}
                                    onClick={showClears}/>
                                <div id="clearsButtons" className="hidden">
                                    <div>
                                        {ConstSteamWebApiKey === '' && (<IdKeyInput
                                            onChange={(event) => {
                                              const value = event.target.value;
                                              const regex = /^[A-Z0-9]+$/;
                                              if (regex.test(value) && value.length === 32) {
                                                setSteamWebApiKey(value);
                                                setApiKeyError('');
                                              } else if (value === '') {
                                                setApiKeyError(t('ApiKeyRequired'));
                                              } else if (value.length !== 32) {
                                                setApiKeyError(t('ApiKeylengthMismatch'));
                                              } else {
                                                setApiKeyError(t('ApiKeyError'));
                                              }
                                            }}
                                            placeholder="Steam api key"/>)}
                                        {apiKeyError && <div className="input-error">{apiKeyError}</div>}</div>
                                    {ConstSteamWebApiKey === '' && (<GameButton
                                        text={t('ChangeKey')}
                                        onClick={handleKeyChange}
                                        id='keyChangeButton'/>)}
                                    {ConstSteamWebApiKey !== '' && (<GameButton text={t('ClearKey')} onClick={handleKeyClear} id='keyClearButton'/>)}

                                    <GameButton text={t('Update')} onClick={handleUpdate} id=''/>
                                </div>
                                <div>
                <ChangeAccount update={handleUpdate}/>
                                <Settings/></div>
                            </div>
                            <div className="MainCont">
                                {personalName && (
                                    <div className="nickname-container">
                                        <label className="nickname">{personalName}</label>
                                        <br></br>
                                        <img src={avaUrl}></img>
                                        <br ></br>
                                        <div className="stats-container">
                                            <label className="nickname">{t('Ach')}: {AchCount}</label>
                                            <br></br>
                                            <br></br>
                                            <label className="nickname">{t('Games')}: {gamesCount}</label>
                                        </div>
                                        <br></br>
                                        <GameButton
                                            id=''
                                            additionalClass="gamesAchButtons"
                                            onClick={() => {
                                              const root = ReactDOM.createRoot(document.getElementById('root'));
                                              root.render(<Games/>);
                                            }}
                                            text={t('GamesWithAch')}/>

                                        <br/>
                                        <GameButton
                                            id=''
                                            additionalClass="gamesAchButtons"
                                            onClick={() => {
                                              const root = ReactDOM.createRoot(document.getElementById('root'));
                                              root.render(<AchPage/>);
                                            }}
                                            text={t('AllAch')}/>
                                        <br></br>
                                        <div className="gain-nonGainMain">
                                            <ProgressRad
                                                title={t('AveragePercent')}
                                                data-progress={percent}
                                                SizeVnu={'9rem'}
                                                SizeVne={'10rem'}/></div>
                                    </div>
                                )}
                                <div className="main-game-cards">
                                    {games.map((game) => (<GameCard key={game.appid} game={game} backWindow="main"/>))}
                                </div>
                                <div className="with-friends">
                                    <div className="last-ach-main" id="container"></div>

                                </div>
                            </div>
                            <div className='diagramCont'>
                                    <Diagram></Diagram></div>
                        </div>
                    </div>
                <br></br>
                <ToastContainer/>
            </div>
        </I18nextProvider>
  );
}

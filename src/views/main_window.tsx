import React, { useCallback, useEffect, useState } from 'react';
import AchCont from './last_ach_container';
import ReactDOM from 'react-dom/client';
import Games from './Games';
import ProgressRad from './rad_progress';
import AchPage from './AchievementsPage';
import ChangeAccount from './changeAccount';
import Settings from './Settings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider, useTranslation } from 'react-i18next';
import IdKeyInput from './IdKeyInput';
import GameButton from './GameButton';
import i18n from '../transate';
import './scss/MainWindow.scss';
import Diagram from './AchDiagram';
import GameCard from './GameCard';
import { ApiService } from '../services/api.services';
import { UpdatedGame, UserData } from '../interfaces';

export default function App () {
  const [SteamWebApiKey,
    setSteamWebApiKey] = useState('');
  const [ConstSteamWebApiKey,
    setConstSteamWebApiKey] = useState('');
  const [personalName,
    setPersonalName] = useState('');
  const [AchCount,
    setAchCount] = useState(0);
  const [gamesCount,
    setGamesCount] = useState(0);
  const [avaUrl,
    setAvaUrl] = useState('');
  const [percent,
    setPercent] = useState(0);
  const [recentGames, setRecentGames] = useState([]);
  const [apiKeyError,
    setApiKeyError] = useState('');
  const { t } = useTranslation();
  const updateRecent = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const userData = await ApiService.put<UpdatedGame>(`user/${dataSteamId}/recent?lang=${i18n.language}`);
    toast.success('+ ' + userData.percent.change.toFixed(2) + '% ' + t('averageUp'));
  }, []);
  const updateUserData = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const achContainer = ReactDOM.createRoot(document.getElementById('container'));

    if (dataSteamId) {
      try {
        const needToUpdate = !sessionStorage.getItem('updatet');
        if (needToUpdate) {
          await updateRecent();
          sessionStorage.setItem('updatet', 'true');
        }

        const userData = await ApiService.get<UserData>(`user/${dataSteamId}/data`);
        setPersonalName(userData.user.nickname);
        setAvaUrl(userData.user.avatarLarge);
        setPercent(userData.user.percent);
        setGamesCount(userData.gameCount);
        setAchCount(userData.achCount);
        setRecentGames(userData.user.gameDatas);
        achContainer.render(<AchCont/>);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleKeyChange = () => {
    setConstSteamWebApiKey(SteamWebApiKey);

    updateUserData();
  };
  const handleKeyClear = () => {
    setConstSteamWebApiKey('');
    localStorage.setItem('api-key', '');
  };
  const handleUpdate = () => {
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

    function handleClickOutside (event) {
      const isOutside = !checkDiv.contains(event.target) && !buttons.includes(event.target.id);
      if (isOutside) {
        div.style.display = 'none';
        checkDiv.style.justifyContent = 'space-between';
        button.style.display = 'block';
        document.removeEventListener('click', handleClickOutside);
      }
    }

    document.addEventListener('click', handleClickOutside);
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
                <ChangeAccount/>
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
                                                data-progress={`${percent}`}
                                                SizeVnu={'9rem'}
                                                SizeVne={'10rem'}/></div>
                                    </div>
                                )}
                                <div className="main-game-cards">
                                    {recentGames.map((game) => (<GameCard key={game.appid} appid={game.appid} backWindow="main"/>))}
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

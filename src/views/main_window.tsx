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
  const [Ach,
    setAch] = useState('');
  const [gamesCount,
    setGamesCount] = useState('');
  const [avaUrl,
    setAvaUrl] = useState('');
  const [percent,
    setPercent] = useState('');
  const [games,
    setGames] = useState([]);
  const [load,
    setLoad] = useState(false);

  const [apiKeyError,
    setApiKeyError] = useState('');
  const { t } = useTranslation();

  const getApi = useCallback(async () => {
    try {
      const dataSteamId = localStorage.getItem('steamId');
      const retData = await fetch(`http://localhost:8888/api/user/all-ach/${dataSteamId}?lang=${t('steamLanguage')}`, {
        method: 'GET'
      });
      const data = await retData.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateUserData = useCallback(async () => {
    const dataKey = localStorage.getItem('api-key');
    const dataSteamId = localStorage.getItem('steamId');
    const achContainer = ReactDOM.createRoot(document.getElementById('container'));

    if (dataKey && dataSteamId) {
      try {
        const response = await fetch(`http://localhost:4500/recent?key=${dataKey}&id=${dataSteamId}`);
        const data = await response.json();
        const before = localStorage.getItem('recent');
        if ((before === undefined) || (before !== JSON.stringify(data)) || (before === null)) {
          const [data,
            userData] = await Promise.all([
            fetch(`http://localhost:4500/recent?key=${dataKey}&id=${dataSteamId}`).then(response => response.json()),
            fetch(`http://localhost:4500/player_sum?key=${dataKey}&id=${dataSteamId}`).then(response => response.json())
          ]);

          localStorage.setItem('recent', JSON.stringify(data));
          const personalName = userData.response.players[0].personaname;
          setPersonalName(personalName);
          const avaUrl = userData.response.players[0].avatarfull;
          localStorage.setItem('ava', avaUrl);
          localStorage.setItem('name', personalName);
          setAvaUrl(avaUrl);
          const ach = await calculateAchievementCount();
          setAch(ach[0].toString());
          const predPercent = localStorage.getItem('percent');
          localStorage.setItem('percent', ach[1].toString());
          setPercent(ach[1].toString());
          achContainer.render(<AchCont/>);

          toast.success('+ ' + (parseFloat(ach[1].toString()) - parseFloat(predPercent)).toFixed(2).toString() + '% ' + t('averageUp'));
        } else {
          try {
            setAvaUrl(localStorage.getItem('ava'));
            setPersonalName(localStorage.getItem('name'));
            const ach = localStorage.getItem('ach');
            const data = JSON.parse(ach);
            setGames(data.sort((a : any, b : any) => new Date(b.last_launch_time).getTime() - new Date(a.last_launch_time).getTime()).slice(0, 3));
            setGamesCount(data.length);
            let achAchCount = 0;
            let percent = 0;
            let gameWithAchCount = 0;
            for (const ach of data) {
              if (ach.Achievement) {
                const achArr = ach
                  .Achievement
                  .filter((ach : any) => (ach as {
                                        unlocked : boolean
                                    }).unlocked);
                const allAchArr = ach.Achievement;
                if (achArr.length > 0) {
                  percent += achArr.length / allAchArr.length * 100;
                  gameWithAchCount += 1;
                }
                achAchCount += achArr.length;
              }
            }
            setPercent((percent / gameWithAchCount).toFixed(2).toString());
            setAch(achAchCount.toString());

            achContainer.render(<AchCont/>);
          } catch (e) {
            console.error(e);
            localStorage.setItem('recent', '');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const calculateAchievementCount = useCallback(async () => {
    setLoad(true);
    const data = await getApi();
    setGamesCount(data.length);
    const dataWithPercentEtc = [];

    let achAchCount = 0;
    let allAchCount = 0;
    let gameWithAchCount = 0;
    if (data.length > 0) {
      for (const ach of data.flat()) {
        if (ach.Achievement) {
          const { Achievement } = ach;
          const achArr = Achievement.filter(({ unlocked } : {
            unlocked: boolean
                    }) => unlocked);

          if (achArr.length > 0) {
            allAchCount += (achArr.length / Achievement.length) * 100;
            gameWithAchCount += 1;
          }

          dataWithPercentEtc.push({
            ...ach,
            percent: (achArr.length / Achievement.length) * 100,
            gained: achArr.length,
            all: Achievement.length
          });

          achAchCount += achArr.length;
        }
      }
      console.log(new Date(dataWithPercentEtc[0].last_launch_time).getTime());
      const sortedGames = dataWithPercentEtc.sort((a : any, b : any) => new Date(b.last_launch_time).getTime() - new Date(a.last_launch_time).getTime()).slice(0, 3);

      const achData = JSON.stringify(dataWithPercentEtc);
      localStorage.setItem('ach', achData);

      setGames(sortedGames);
      setLoad(false);
      toast.success(t('Success'));
      return [
        achAchCount,
        (allAchCount / gameWithAchCount).toFixed(2),
        gameWithAchCount
      ];
    } else {
      setLoad(false);
      toast.error(t('LoadFail'));
      console.log('data is 0');
      return [0, 0, 0];
    }
  }, [getApi]);
  const handleKeyChange = () => {
    setConstSteamWebApiKey(SteamWebApiKey);
    localStorage.setItem('recent', '');
    localStorage.setItem('api-key', SteamWebApiKey);
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
                <LoadingOverlay active={load} spinner={< BounceLoader />}>

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
                                            <label className="nickname">{t('Ach')}: {Ach}</label>
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
                </LoadingOverlay>
                <br></br>
                <ToastContainer/>
            </div>
        </I18nextProvider>
  );
}

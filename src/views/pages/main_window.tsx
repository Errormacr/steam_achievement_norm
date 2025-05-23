import React, { useCallback, useEffect, useState } from 'react';
import AchCont from '../features/last_ach_container';
import ReactDOM from 'react-dom/client';
import ProgressRad from '../components/rad_progress';
import ChangeAccount from '../pages/changeAccount';
import Settings from '../pages/Settings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider, useTranslation } from 'react-i18next';
import GameButton from '../components/GameButton';
import i18n from '../../transate';
import '../scss/MainWindow.scss';
import GameCard from '../components/GameCard';
import { ApiService } from '../../services/api.services';
import { UserData } from '../../interfaces';
import ChangeKey from '../features/ChangeKey';
import UpdateUserData from '../features/UpdateUserData';
import { useNavigate } from 'react-router-dom';
export default function App () {
  const navigate = useNavigate();
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
  const [recentGames,
    setRecentGames] = useState([]);
  const { t } = useTranslation();
  const updateUserData = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const achContainer = ReactDOM.createRoot(document.getElementById('container'));

    if (dataSteamId) {
      try {
        const userData = await ApiService.get < UserData >(`user/${dataSteamId}/data`);
        setPersonalName(userData.user.nickname);
        setAvaUrl(userData.user.avatarLarge);
        setPercent(userData.user.percent);
        setGamesCount(userData.gameCount);
        setAchCount(userData.achCount);
        setRecentGames(userData.user.gameDatas);
        achContainer.render(<AchCont/>);
      } catch (e) {
        console.error('Error updating user data:', e);
        toast.error('Failed to update user data. Please try again.');
      }
    }
  }, []);

  useEffect(() => {
    try {
      updateUserData();
    } catch (error) {
      console.error('Error in useEffect:', error);
      toast.error('An error occurred while updating data. Please try again.');
    }
  }, [updateUserData]);

  return (
        <I18nextProvider i18n={i18n}>
            <div id="header key" className="header">
                <div>
                    <div id="clearDiv" className="clearDiv">
                        <div className='account-settings'>
                            <UpdateUserData key='updateUserData' rerender={() => updateUserData()}/>
                            <ChangeAccount updatePage={updateUserData}/>
                            <ChangeKey/>
                        </div>
                        <Settings/>
                    </div>
                    <div className="MainCont">
                        {personalName && (
                            <div className="nickname-container">
                                <label className="nickname">{personalName}</label>
                                <br></br>
                                <img alt={'avatar'} className="avatar" src={avaUrl}></img>
                                <br></br>
                                <div className="stats-container">
                                    <label className="nickname">
                                        {t('Ach')}: {AchCount}
                                    </label>
                                    <br></br>
                                    <br></br>
                                    <label className="nickname">
                                        {t('Games')}: {gamesCount}
                                    </label>
                                </div>
                                <br/>
                                <GameButton
                                    id=""
                                    additionalClass="gamesAchButtons"
                                    onClick={() => {
                                      navigate('/Games');
                                    }}
                                    text={t('GamesWithAch')}/>

                                <br/>
                                <GameButton
                                    id=""
                                    additionalClass="gamesAchButtons"
                                    onClick={() => {
                                      navigate('/Achievements/0/100/undefined/main/undefined');
                                    }}
                                    text={t('AllAch')}/>
                                <br/>
                                <GameButton
                                    id=""
                                    additionalClass="gamesAchButtons"
                                    onClick={() => {
                                      navigate('/Stats/0');
                                    }}
                                    text={t('Stats')}/>
                                <br/>
                                <div className="gain-nonGainMain">
                                    <ProgressRad
                                        title={t('AveragePercent')}
                                        data-progress={`${percent}`}
                                        SizeVnu={'9rem'}
                                        SizeVne={'10rem'}/>
                                </div>
                            </div>
                        )}
                        <div className="main-game-cards">
                            {recentGames.map((game) => (<GameCard key={game.appid} appid={game.appid} backWindow="main"/>))}
                        </div>
                        <div className="with-friends">
                            <div className="last-ach-main" id="container"></div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <ToastContainer/>
        </I18nextProvider>
  );
}

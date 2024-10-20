import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Table from './Table';
import App from './main_window';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import ScrollToTopButton from './ScrollToTopButton';
import GameButton from './GameButton';
import AchBox from './AchContainer';

export default function AchPage () {
  const [tableOrBox,
    setTable] = useState(true);
  const [loaded,
    setLoaded] = useState(false);
  const [achCount, setAchCount] = useState(0);
  const { t } = useTranslation();
  useEffect(useCallback(() => {
    try {
      const boxView = Boolean(localStorage.getItem('boxView'));
      const steamId = localStorage.getItem('steamId');
      const baseUrl = `http://localhost:8888/api/user/${steamId}/achievements?orderBy=unlockedDate&desc=1&language=${i18n.language}&unlocked=1&page=1&pageSize=0&`;
      fetch(baseUrl).then(resp => { resp.json().then(data => { setAchCount(data.count); }); });
      if (!boxView) {
        setTable(false);
      }
      setLoaded(true);
    } catch (error) {
      window.alert(error.message);
    }
  }, []), []);
  return (
        <I18nextProvider i18n={i18n}>
            <div>
                <ScrollToTopButton/>
                <div className="label-container">
                    <GameButton
                        id=''
                        onClick={() => {
                          const root = ReactDOM.createRoot(document.getElementById('root'));
                          root.render(<App/>);
                        }}
                        additionalClass="return"
                        text={t('Return')}/>
                    <label className="game-label">{achCount} {t('Ach')}</label>
                    <GameButton
                        id=''
                        onClick={() => {
                          setTable(!tableOrBox);
                          localStorage.setItem('boxView', String(!tableOrBox));
                        }}
                        additionalClass="switchTable"
                        text={t('SwitchTable')}/>
                </div>
                <div className="details-container table-container">
                    {loaded && (tableOrBox
                      ? (<Table
                       all={true}
                         />)
                      : (<AchBox all={true}/>))
}</div>
            </div>
        </I18nextProvider>
  );
}

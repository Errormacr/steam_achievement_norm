import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Table from './Table';
import App from './main_window';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import ScrollToTopButton from './ScrollToTopButton';
import GameButton from './GameButton';
import AchBox from './AchContainer';
import { DatumClass } from './interfaces/TableData';
interface achiv {
    achivment : DatumClass;
    gameName : string;
}
export default function AchPage () {
  const [achivments,
    setAchivments] = useState([{}]);
  const [tableOrBox,
    setTable] = useState(true);
  const [loaded,
    setLoaded] = useState(false);
  const { t } = useTranslation();
  useEffect(useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('ach'));
      console.log(data);
      const achivmentsArr : any[] = [];
      for (const game of data) {
        for (const ach of game.Achievement) {
          if (ach.unlocked) {
            achivmentsArr.push({ achivment: ach, gameName: game.gameName });
          }
        }
      }
      console.log(achivmentsArr);
      const boxView = Boolean(localStorage.getItem('boxView'));
      if (!boxView) {
        setTable(false);
      }
      setAchivments(achivmentsArr);
      setLoaded(true);
    } catch (error) {
      window.alert(error.message);
    }
  }, [achivments]), []);
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
                    <label className="game-label">{achivments.length} {t('Ach')}</label>
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
                            data={
                        {
                          achievements: achivments.map((achiv : achiv) => {
                            return achiv.achivment;
                          }),
                          allAch: true
                        }}/>)
                      : (<AchBox data={[achivments, true]}/>))
}</div>
            </div>
        </I18nextProvider>
  );
}

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
  const [tableOrBox,
    setTable] = useState(true);
  const [loaded,
    setLoaded] = useState(false);
  const { t } = useTranslation();
  useEffect(useCallback(() => {
    try {
      const boxView = Boolean(localStorage.getItem('boxView'));
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
                    {/* <label className="game-label">{achivments.length} {t('Ach')}</label> */}
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
                      ? <div></div>

                      // (<Table
                      //       data={
                      //   {
                      //     achievements: achivments.map((achiv : achiv) => {
                      //       return achiv.achivment;
                      //     }),
                      //     allAch: true
                      //   }}/>)
                      : (<AchBox all={true}/>))
}</div>
            </div>
        </I18nextProvider>
  );
}

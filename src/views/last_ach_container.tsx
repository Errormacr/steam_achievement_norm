import React, { useCallback, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import './scss/LastAchCont.scss';
export default function AchCont () {
  const [allAch,
    setAllAch] = useState([]);

  useEffect(useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('ach'));
      const allAch = data.reduce((acc : any, cur : any) => {
        let arr = cur.Achievement;
        arr = arr.map((ach : any) => {
          return {
            ...ach,
            gamename: cur.gameName
          };
        });
        acc = acc.concat(arr);
        return acc;
      }, []);
      allAch.sort((a : any, b : any) => b.unlocktime - a.unlocktime);
      setAllAch(allAch.slice(0, 36));
    } catch (err) {
      window.alert(err.message);
    }
  }, []), []);
  return (
        <I18nextProvider i18n={i18n}>
            <div className="last_ach_container">

                {allAch.map((ach) => (
                    <div className="Cont" key={ach.name}>
                        <div className="Mask">
                            <div className="second_mask">
                                <div className={ach.percent <= 5
                                  ? 'third_mask Crare1'
                                  : ach.percent <= 20
                                    ? 'third_mask Crare2'
                                    : ach.percent <= 45
                                      ? 'third_mask Crare3'
                                      : ach.percent <= 60
                                        ? 'third_mask Crare4'
                                        : 'third_mask Crare5'}></div>
                            </div>
                        </div>
                <img
                    className={ach.percent <= 5
                      ? 'rare1'
                      : ach.percent <= 20
                        ? 'rare2'
                        : ach.percent <= 45
                          ? 'rare3'
                          : ach.percent <= 60
                            ? 'rare4'
                            : 'rare5'}
                    key={ach.name}
                    src={ach.icon}
                    alt={ach.displayName}
                    title={`${ach
                    .gamename}\n${ach
                    .displayName}\n${ach
                    .description}\n${ach
                    .percent
                    .toFixed(2)}\n${new Date(ach.unlocktime * 1000)}`}/>

                    </div>))}
            </div>
        </I18nextProvider>
  );
}

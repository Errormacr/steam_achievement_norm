import {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import Table from './Table';
import App from "./main_window";
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import ScrollToTopButton from "./ScrollToTopButton";
import AchBox from "./AchContainer";
interface achiv {
    achivment : [];
    gameName : string;
}
export default function AchPage() {
    const [achivments,
        setAchivments] = useState([{}]);
    const [tableOrBox,
        setTable] = useState(true);
    const [loaded,
        setLoaded] = useState(false);
    const {t} = useTranslation();
    useEffect(useCallback(() => {
        try {
            const data = JSON.parse(localStorage.getItem("ach"));
            const achivmentsArr : any[] = []
            for (let game of data) {
                for (let ach of game.Achievement) {
                    if (ach.achieved) {
                        achivmentsArr.push({achivment: ach, gameName: game.gameName});
                    }
                }
            }
            setAchivments(achivmentsArr);
            console.log(achivments);
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
                    <button
                        onClick={() => {
                        const root = ReactDOM.createRoot(document.getElementById("root"));
                        root.render(<App/>);
                    }}
                        className="gameButton return">{t('Return')}</button>
                    <label className="game-label">{achivments.length} {t("Ach")}</label>
                    <button onClick={() => {setTable(!tableOrBox);}}
                     className="gameButton switchTable">{t('SwitchTable')}</button>
                </div>
                <div className="details-container table-container">
                    {loaded && (tableOrBox
                        ? (<Table
                            data={[
                            achivments.map((achiv: achiv)=> {return achiv.achivment}),
                            true
                        ]}/>)
                        : (<AchBox
                            data={[
                            achivments,
                            true
                        ]}/>))
}</div>
            </div>
        </I18nextProvider>
    )
}
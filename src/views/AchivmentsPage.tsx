import {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import Table from './Table';
import App from "./main_window";
export default function AchPage() {
    const [achivments,
        setAchivments] = useState([{}]);
    const [loaded,
        setLoaded] = useState(false);
    useEffect(useCallback(() => {
        try {
            const data = JSON.parse(localStorage.getItem("ach"));
            const achivmentsArr : any[] = []
            for (let game of data) {
                for (let ach of game.Achievement) {
                    if (ach.achieved) {
                        achivmentsArr.push(ach);
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
        <div>
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <button
                    style={{
                    left: "0",
                    marginLeft: "1rem",
                    position: "absolute",
                    padding: "1rem"
                }}
                    onClick={() => {
                    const root = ReactDOM.createRoot(document.getElementById("root"));
                    root.render(<App/>);
                }}
                    className="gameButton">Return</button>
                <label
                    style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    fontSize: "2rem"
                }}>{achivments.length} достижений</label>
            </div>
            <div style={{
                marginTop: "1rem"
            }}>
                {loaded && (<Table
                    data={achivments.sort((a : any, b : any) => {
                    return (b.unlocktime - a.unlocktime)
                })}/>)
}</div>
        </div>
    )
}
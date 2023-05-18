import React, {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import User from "./personal_data_main_win";
export default function App() {
    const [SteamWebApiKey,
        setSteamWebApiKey] = useState("");
    const [ConstSteamWebApiKey,
        setConstSteamWebApiKey] = useState("");
    const [ConstSteamId,
        setConstSteamId] = useState("");
    const [SteamId,
        setSteamId] = useState("");
    function setname() {
        const user = ReactDOM.createRoot(document.getElementById("personal data"));
        user.render(<User/>);
    }
    useEffect(useCallback(() => {
        try {
            const data = localStorage.getItem("api-key");
            if (data != undefined) {
                setConstSteamWebApiKey(data);
            }
            const data_st_id = localStorage.getItem("steamId");
            if (data_st_id != undefined) {
                setConstSteamId(data_st_id);
            }
            setname();
        } catch (error) {
            window.alert(error.message);
        }
        // setConstSteamWebApiKey(""); setConstSteamId("");
    }, []), []);
    console.log(SteamWebApiKey);
    return (
        <div id="header key">
            <div>
                {ConstSteamWebApiKey == "" && (<input
                    placeholder="Steam api key"
                    id="key"
                    onChange={(event) => {
                    setSteamWebApiKey(event.target.value);
                }}/>)}
                {ConstSteamWebApiKey == "" && (
                    <button
                        type="button"
                        onClick={(event) => {
                        setConstSteamWebApiKey(SteamWebApiKey);
                        localStorage.setItem('api-key', SteamWebApiKey);
                        setname();
                    }}>Change key</button>
                )}

                {ConstSteamWebApiKey != "" && (
                    <button
                        type="button"
                        onClick={(event) => {
                        setConstSteamWebApiKey("");
                        localStorage.setItem('api-key', "");
                    }}>Clear key</button>
                )}
            </div>
            <div>
                {ConstSteamId == "" && (<input
                    placeholder="Steam id"
                    id="key"
                    onChange={(event) => {
                    setSteamId(event.target.value);
                }}/>)}

                {ConstSteamId == "" && (
                    <button
                        type="button"
                        onClick={(event) => {
                        setConstSteamId(SteamId);
                        localStorage.setItem('steamId', SteamId);
                        setname();
                    }}>Change steamID</button>
                )}</div>

            {ConstSteamId != "" && (
                <button
                    type="button"
                    onClick={(event) => {
                    setConstSteamId("");
                    localStorage.setItem('steamId', "");
                }}>Clear key</button>
            )}

        </div>
    )
}
import React, {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import App from "./main_window";
function rend_app() {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App/>);
};
export default function Games() {
    useEffect(useCallback(() => {

        try {} catch (error) {
            window.alert(error.message);
        }

    }, []), []);
    return (
        <div id="header key">
            <label>Games</label>
            <br/>
            <div
                style={{
                width: "400px",
                height: "200px",
                position: "relative"
            }}>
                <div className="container">
                    <p>Magicka</p>
                    <img
                        style={{
                        backgroundImage: 'url("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/440/e3f595a92552da3d664ad00277fad2107345f743.jpg")',
                        padding: "20px",
                        height: "10%",
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundSize: "contain"
                    }}></img>
                </div>
                <div className="progress-bar">
                    <div
                        className="bar"
                        style={{
                        width: "75%"
                    }}></div>
                </div>
                <div
                    style={{
                    backgroundColor:"gray",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "3px solid black",
                    zIndex: -1,
                    backgroundSize: "cover"
                }}></div>
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 1"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 2"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 3"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 4"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 5"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 6"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                    <img
                        src="https://steamcdn-a.akamaihd.net/steam/apps/42910/header.jpg"
                        alt="Square image 7"
                        style={{
                        width: "45px",
                        height: "45px",
                        filter: "none"
                    }}/>
                </div>
            </div>
        </div>

    )

}
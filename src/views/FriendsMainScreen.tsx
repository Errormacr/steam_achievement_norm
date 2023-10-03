import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from 'i18next';
import './scss/FriendsTable.scss';
import ProgressBar from "./ProgressBar";
export function FriendTable() {
    const {t} = useTranslation();

    return (
        <I18nextProvider i18n={i18n}>
            <div style={{backgroundColor:"gray", width:"27rem", marginLeft:"0.3rem"}}>
            <ul style={{width:"100%",display:"flex",flexDirection:"row"}}>
                <img style={{width: "3rem",height: "3rem",backgroundColor: "white"}}/>
                <p style={{marginLeft:"1rem" , color:"white"}}>NickName</p>
                <ProgressBar value={100}/>
            </ul>
            <ul style={{width:"100%",display:"flex",flexDirection:"row"}}>
                <img style={{width: "3rem",height: "3rem",backgroundColor: "white"}}/>
                <p style={{marginLeft:"1rem" , color:"white"}}>NickName</p>
                <ProgressBar value={100}/>
            </ul>
            </div>
        </I18nextProvider>
    );
}

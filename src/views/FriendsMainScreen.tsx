import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from 'i18next';
import './scss/FriendsTable.scss';


export function FriendTable({game, backWindow} : any) {
    const {t} = useTranslation();

    return (
        <I18nextProvider i18n={i18n}>
            <div className="FriendsTable">
            </div>
        </I18nextProvider>
    );
}

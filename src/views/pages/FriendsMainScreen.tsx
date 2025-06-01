import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import ProgressBar from '../components/ProgressBar';

export function FriendTable () {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="friends-table">
        <ul className="friend-row">
          <img className="avatar" alt="avatar" />
          <p className="nickname">NickName</p>
          <ProgressBar value={100} />
        </ul>
        <ul className="friend-row">
          <img className="avatar" alt="avatar" />
          <p className="nickname">NickName</p>
          <ProgressBar value={100} />
        </ul>
      </div>
    </I18nextProvider>
  );
}

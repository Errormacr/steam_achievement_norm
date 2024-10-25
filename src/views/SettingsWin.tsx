import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './scss/Settings.scss';
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const SettingsWin : React.FC < ModalProps > = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  const [changeKey,
    setChangeKey] = useState(false);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const changeLanguage = (language : string) => {
    i18n.changeLanguage(language);
  };
  const revealChangeKey = () => {
    setChangeKey(true);
  };
  return (
        <div className="modal">
            <div className="modal-content">
                <h2 className='settingsHeader'>{t('Settings')}</h2>
                <select
                    className='settingsSelect'
                    value={i18n.language}
                    onChange={(event) => changeLanguage(event.target.value)}>
                    <option value="english">{t('English')}</option>
                    <option value="russian">{t('Russian')}</option>
                </select>
                <button className='settingsButton' onClick={revealChangeKey}>Change key</button>
                {changeKey && <div>test</div>}
                <button className='settingsButton' onClick={onClose}>OK</button>
            </div>
        </div>
  );
};

export default SettingsWin;

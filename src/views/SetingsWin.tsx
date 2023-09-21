import React from 'react';
import {useTranslation} from 'react-i18next';
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const SetingsWin : React.FC < ModalProps > = ({isOpen, onClose}) => {
    if (!isOpen) {
        return null;
    }
    const {i18n} = useTranslation();
    const {t} = useTranslation();
    const changeLanguage = (language : string) => {
        i18n.changeLanguage(language);
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className='settingsHeader'>{t('Settings')}</h2>
                <select
                    className='settingsSelect'
                    value={i18n.language}
                    onChange={(event) => changeLanguage(event.target.value)}>
                    <option value="en">{t('English')}</option>
                    <option value="ru">{t('Russian')}</option>
                </select>
                <button className='settingsButton' onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default SetingsWin;

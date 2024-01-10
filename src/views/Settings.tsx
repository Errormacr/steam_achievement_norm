import React, {useState} from 'react';
import SettingsWin from './SettingsWin';
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
export default function Settings() {
    const [isOpen,
        setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const {t} = useTranslation();
    return (
        <I18nextProvider i18n={i18n}>
            
                <GameButton id='' additionalClass='' onClick={openModal} text={t('Settings')}/>
                {isOpen && <SettingsWin isOpen={isOpen} onClose={closeModal}/>}
            
        </I18nextProvider>
    );
}
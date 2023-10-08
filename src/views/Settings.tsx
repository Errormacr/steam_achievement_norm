import React, {useState} from 'react';
import SetingsWin from './SetingsWin';
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import {useTranslation} from 'react-i18next';
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
            <div>
                <GameButton id='' additionalClass='' onClick={openModal} text={t('Settings')}/>
                {isOpen && <SetingsWin isOpen={isOpen} onClose={closeModal}/>}
            </div>
        </I18nextProvider>
    );
}
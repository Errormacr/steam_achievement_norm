import React, { useState } from 'react';
import SettingsWin from './SettingsWin';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { FaGear } from 'react-icons/fa6';
export default function Settings () {
  const [isOpen,
    setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
        <I18nextProvider i18n={i18n}>

                <FaGear onClick={openModal} className="button-icon"/>
                {isOpen && <SettingsWin isOpen={isOpen} onClose={closeModal}/>}

        </I18nextProvider>
  );
}

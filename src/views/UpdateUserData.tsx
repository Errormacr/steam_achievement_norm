import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import { ApiService } from '../services/api.services';
import { toast } from 'react-toastify';
export default function UpdateUserData ({ rerender } : {
    rerender: () => void
}) : React.JSX.Element {
  const [isOpen,
    setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();
  useEffect(() => {
    const handleOutsideClick = (event : MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.modal-content')) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const update = async (type : string) => {
    try {
      const steamId = localStorage.getItem('steamId');
      await ApiService.put(`user/${steamId}/${type}`);
      rerender();
      toast.success(t('updateUserDa taSuccess'));
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(t('updateUserDataError'));
    }
  };

  return (
        <I18nextProvider i18n={i18n}>
            <GameButton
                id=''
                additionalClass='update-button'
                onClick={openModal}
                text={t('Update')}/> {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='settingsHeader'>{t('updateUserDataHeading')}</h2>
                        <div>
                            <GameButton
                                id='update-recent'
                                onClick={() => update('recent')}
                                text={t('updateRecent')}/>
                            <GameButton
                                id='update-played-owned'
                                onClick={() => update('owned-played')}
                                text={t('updatePlayedOwned')}/>
                            <GameButton
                                id='update-all'
                                onClick={() => update('all')}
                                text={t('updateAll')}/>
                            <GameButton
                                id='update-all-force'
                                onClick={() => update('all-force')}
                                text={t('updateAllForce')}/>
                            <GameButton
                                id='update-percent-ach'
                                onClick={() => update('ach-percentage')}
                                text={t('updatePercentAch')}/></div>
                    </div>
                </div>
                )}
        </I18nextProvider>
  );
}

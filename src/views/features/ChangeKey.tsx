import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from '../components/GameButton';
import IdKeyInput from '../components/IdKeyInput';
import '../scss/ChangeKey.scss';
import { toast } from 'react-toastify';
import { ApiService } from '../../services/api.services';

export default function ChangeKey (): React.JSX.Element {
  const [isOpen,
    setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
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

  const OnUpdateKeyField = (val: { target: { value: React.SetStateAction<string>; }; }) => {
    setApiKey(val.target.value);
  };

  const changeApiKey = async () => {
    if (apiKey) {
      try {
        await ApiService.post('steam-api/api-token', { token: apiKey });
        toast.success(t('changeKeySuccess'));
        closeModal();
      } catch (error) {
        console.log(error);
        toast.error(t('changeKeyError'));
      }
    }
  };

  return (
        <I18nextProvider i18n={i18n}>
            <GameButton id='' additionalClass='' onClick={openModal} text={t('changeKey')}/> {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='settingsHeader'>{t('chKeyHeading')}</h2>
                      <IdKeyInput onChange={OnUpdateKeyField} placeholder={'steam web api key'} />
                      {apiKey && <GameButton id='changeKeyButton' additionalClass='change-key-button' onClick={changeApiKey } text={t('ChangeKey')}/>
                    }</div>
                </div>
            )}
        </I18nextProvider>
  );
}

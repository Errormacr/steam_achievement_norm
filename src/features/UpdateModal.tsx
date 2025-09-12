import React from 'react';
import { useTranslation } from 'react-i18next';
import GameButton from '../components/GameButton';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (type: string) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <button className="modal" style={{ border: 'none' }} onClick={onClose}>
      <button className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="settingsHeader">{t('updateUserDataHeading')}</h2>
        <div className="update-buttons">
          <GameButton
            id="update-recent"
            onClick={() => onUpdate('recent')}
            text={t('updateRecent')}
          />
          <GameButton
            id="update-played-owned"
            onClick={() => onUpdate('owned-played')}
            text={t('updatePlayedOwned')}
          />
          <GameButton
            id="update-all"
            onClick={() => onUpdate('all')}
            text={t('updateAll')}
          />
          <GameButton
            id="update-all-force"
            onClick={() => onUpdate('all-force')}
            text={t('updateAllForce')}
          />
          <GameButton
            id="update-percent-ach"
            onClick={() => onUpdate('ach-percentage')}
            text={t('updatePercentAch')}
          />
        </div>
      </button>
    </button>
  );
};

export default UpdateModal;

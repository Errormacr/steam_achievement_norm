import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { GrUpdate } from 'react-icons/gr';
import UpdateProgress from './UpdateGameProgress';
import UpdateModal from './UpdateModal';
import { useUpdateSocket } from '../hooks/useUpdateSocket';

export default function UpdateUserData ({ rerender }: Readonly<{ rerender: () => void }>): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isUpdating, startUpdate, progress } = useUpdateSocket(rerender);

  const handleUpdate = (type: string) => {
    startUpdate(type);
    setIsModalOpen(false);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <GrUpdate
        id=""
        className="button-icon update-button"
        onClick={() => setIsModalOpen(true)}
      />
      <UpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
      />

      {isUpdating && (
        <div className={'modal'}>
          <UpdateProgress progress={progress} />
        </div>
      )}
    </I18nextProvider>
  );
}

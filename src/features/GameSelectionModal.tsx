import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Portal from '../components/Portal';
import GameButton from '../components/GameButton';

interface GameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  allGames: string[];
  selectedGames: string[];
  onApply: (selected: string[]) => void;
}

export const GameSelectionModal: React.FC<GameSelectionModalProps> = ({
  isOpen,
  onClose,
  allGames,
  selectedGames,
  onApply,
}) => {
  const { t } = useTranslation();
  const [tempSelectedGames, setTempSelectedGames] = useState(selectedGames);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset temp selection when modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedGames(selectedGames);
      setSearchQuery('');
    }
  }, [isOpen, selectedGames]);

  const filteredGames = useMemo(() => {
    return allGames.filter(gameName => gameName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allGames, searchQuery]);

  const handleTempGameSelection = (gameName: string) => {
    setTempSelectedGames(prevSelected =>
      prevSelected.includes(gameName)
        ? prevSelected.filter(name => name !== gameName)
        : [...prevSelected, gameName]
    );
  };

  const handleApplySelection = () => {
    onApply(tempSelectedGames);
    onClose();
  };

  const handleSelectAllFiltered = () => {
    setTempSelectedGames(prev => [...new Set([...prev, ...filteredGames])]);
  };

  const handleDeselectAllFiltered = () => {
    setTempSelectedGames(prev => prev.filter(name => !filteredGames.includes(name)));
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{t('selectGames')}</h3>
          <input
            type="text"
            placeholder={t('searchGames')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '90%', margin: '10px', padding: '5px' }}
          />
          <div className="modal-actions" style={{ justifyContent: 'flex-start', padding: '0 10px' }}>
            <GameButton onClick={handleSelectAllFiltered} id={'select-all-filtered'} text={t('selectAllVisible')} style={{ marginRight: 0 }} />
            <GameButton onClick={handleDeselectAllFiltered} id={'deselect-all-filtered'} text={t('deselectAllVisible')} style={{ marginRight: 0 }} />
          </div>
          <div className="modal-scrollable-content">
            {filteredGames.map(gameName => (
              <label key={gameName} style={{ display: 'block', margin: '5px 0' }}>
                <input
                  type="checkbox"
                  checked={tempSelectedGames.includes(gameName)}
                  onChange={() => handleTempGameSelection(gameName)}
                />
                {gameName}
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <GameButton onClick={handleApplySelection} id={'apply-selection'} text={t('apply')} style={{ marginRight: 0 }} />
            <GameButton onClick={onClose} id={'cancel-selection'} text={t('cancel')} style={{ marginRight: 0 }} />
          </div>
        </div>
      </div>
    </Portal>
  );
};

import React, { useState } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  buttonText: string;
  onReset?: () => void;
}

const unstyledButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0',
  margin: '0',
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer'
};

const dropdownOptionStyles: React.CSSProperties = {
  ...unstyledButton,
  width: '100%',
  padding: '8px 12px',
  textAlign: 'left'
};

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onReset}
      className="cross"
      aria-label={t('resetSelection')}
      style={unstyledButton}
    >
      <div className="horizontal"></div>
      <div className="vertical"></div>
    </button>
  );
};

interface DropdownListProps {
  options: DropdownOption[];
  selectedValue: string | null;
  handleSelect: (value: string) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ options, selectedValue, handleSelect }) => {
  const { t } = useTranslation();
  return (
    <ul className="dropdown-list">
      {options.map((option) => (
        <li key={option.value} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <button
            className={selectedValue === option.value ? 'active' : ''}
            onClick={() => handleSelect(option.value)}
            style={dropdownOptionStyles}
          >
            {t(option.label)}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect, buttonText, onReset }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown-container">
      {onReset && selectedValue && <ResetButton onReset={onReset} />}
      <button
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t(buttonText)}
      </button>
      {isOpen && (
        <DropdownList
          options={options}
          selectedValue={selectedValue}
          handleSelect={handleSelect}
        />
      )}
    </div>
  );
};

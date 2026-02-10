import React, { useState } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useTranslation } from 'react-i18next';
import { ResetButton } from './ResetButton';

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

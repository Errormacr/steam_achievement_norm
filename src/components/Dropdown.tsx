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
      {onReset && selectedValue && (
        <div
          role="button"
          tabIndex={0}
          onClick={onReset}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onReset(); } }}
          className="cross"
        >
          <div className="horizontal"></div>
          <div className="vertical"></div>
        </div>
      )}
      <button
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t(buttonText)}
      </button>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              tabIndex={0}
              key={option.value}
              className={selectedValue === option.value ? 'active' : ''}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { handleSelect(option.value); }
              }}
            >
              {t(option.label)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

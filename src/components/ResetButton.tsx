import React from 'react';
import { useTranslation } from 'react-i18next';

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset, className = 'reset-button' }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onReset}
      className={className}
      aria-label={t('resetSelection')}
    >
      <svg
        viewBox="0 0 12 12"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="1" y1="11" x2="11" y2="1" />
        <line x1="1" y1="1" x2="11" y2="11" />
      </svg>
    </button>
  );
};

import React from 'react';

interface AchievementFallbackIconProps {
  className?: string;
  size?: number;
  gray?: boolean;
}

const AchievementFallbackIcon: React.FC<AchievementFallbackIconProps> = ({
  className = '',
  size = 64,
  gray = false,
}) => {
  const fill = gray ? '#4a4a4a' : '#8a8a8a';
  const stroke = gray ? '#2a2a2a' : '#3a3a3a';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-fallback-icon="true"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="8"
        ry="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      />
      <circle cx="32" cy="24" r="8" fill="none" stroke={stroke} strokeWidth="2" />
      <path
        d="M24 46c0-6.627 5.373-12 12-12s12 5.373 12 12"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 36v6"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 42h8"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 46h8"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="24" r="2" fill={stroke} />
      <circle cx="26" cy="20" r="1.5" fill={stroke} />
      <circle cx="38" cy="20" r="1.5" fill={stroke} />
    </svg>
  );
};

export default AchievementFallbackIcon;

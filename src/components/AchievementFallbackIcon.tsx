import React, { useId } from 'react';

interface AchievementFallbackIconProps {
  className?: string;
  size?: number;
  gray?: boolean;
  /** Tooltip text; shown via a native SVG <title> element. */
  title?: string;
}

/**
 * Placeholder for achievement icons Steam's CDN cannot serve (404).
 * Drawn as a medal so it still reads as "achievement" rather than as a
 * generic missing-image glyph.
 */
const AchievementFallbackIcon: React.FC<AchievementFallbackIconProps> = ({
  className = '',
  size = 64,
  gray = false,
  title,
}) => {
  // Many of these render on one page, so gradient ids must be unique per
  // instance - otherwise every medal would resolve to the first one.
  const id = useId();

  const palette = gray
    ? {
        ribbon: '#4b5563',
        ribbonDark: '#374151',
        disc: '#6b7280',
        discDark: '#4b5563',
        rim: '#9ca3af',
        star: '#e5e7eb',
        starDark: '#9ca3af',
      }
    : {
        ribbon: '#d94f4f',
        ribbonDark: '#a83b3b',
        disc: '#f0b429',
        discDark: '#c98a12',
        rim: '#fde68a',
        star: '#fffbeb',
        starDark: '#e8b53c',
      };

  const discGradient = `${id}-disc`;
  const starGradient = `${id}-star`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-fallback-icon="true"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      {/* Native SVG tooltip: an svg has no title attribute like an img does,
          so the text must live in a <title> child to be announced on hover. */}
      {title && <title>{title}</title>}

      <defs>
        <linearGradient id={discGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.disc} />
          <stop offset="100%" stopColor={palette.discDark} />
        </linearGradient>
        <linearGradient id={starGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.star} />
          <stop offset="100%" stopColor={palette.starDark} />
        </linearGradient>
      </defs>

      {/* Ribbon tails, drawn first so the disc overlaps their top edge. */}
      <g strokeLinejoin="round" strokeWidth="1.5">
        <path
          d="M22 36 L15 60 L27 54 L31 45 Z"
          fill={palette.ribbon}
          stroke={palette.ribbonDark}
        />
        <path
          d="M42 36 L49 60 L37 54 L33 45 Z"
          fill={palette.ribbon}
          stroke={palette.ribbonDark}
        />
      </g>

      {/* Disc. */}
      <circle
        cx="32"
        cy="26"
        r="19"
        fill={`url(#${discGradient})`}
        stroke={palette.rim}
        strokeWidth="2.5"
      />
      <circle
        cx="32"
        cy="26"
        r="14.5"
        fill="none"
        stroke={palette.rim}
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Five-pointed star. */}
      <path
        d="M32 16 L34.47 22.6 L41.51 22.91 L35.99 27.3 L37.88 34.09 L32 30.2 L26.12 34.09 L28.01 27.3 L22.49 22.91 L29.53 22.6 Z"
        fill={`url(#${starGradient})`}
        stroke={palette.discDark}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AchievementFallbackIcon;

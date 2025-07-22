import React from 'react';

interface CircularProgressSVGProps {
    percent: number;
    size: number;
    strokeWidth: number;
}

const CircularProgressSVG: React.FC<CircularProgressSVGProps> = ({
  percent,
  size,
  strokeWidth
}) => {
  const integerPercent = Math.floor(percent);
  const fractionalPercent = (percent - integerPercent) * 100;

  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = (size - strokeWidth) / 2 - strokeWidth * 1.5;

  const outerCircumference = outerRadius * 2 * Math.PI;
  const innerCircumference = innerRadius * 2 * Math.PI;

  const outerOffset = outerCircumference - (integerPercent / 100) * outerCircumference;
  const innerOffset = innerCircumference - (fractionalPercent / 100) * innerCircumference;

  return (
        <svg
            height={size}
            width={size}
        >
            {/* Background for outer circle */}
            <circle
                stroke="#d3d3d3"
                fill="transparent"
                strokeWidth={strokeWidth / 2} // Made outer circle background thinner
                r={outerRadius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Foreground for outer circle (integer part) */}
            <circle
                stroke="#f44336" // Red color
                fill="transparent"
                strokeWidth={strokeWidth / 2} // Made outer circle foreground thinner
                strokeDasharray={outerCircumference + ' ' + outerCircumference}
                strokeDashoffset={outerOffset}
                r={outerRadius}
                cx={size / 2}
                cy={size / 2}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.35s'
                }}
            />

            {/* Background for inner circle */}
            <circle
                stroke="#d3d3d3"
                fill="transparent"
                strokeWidth={strokeWidth / 2} // Made inner circle background thinner
                r={innerRadius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Foreground for inner circle (fractional part) */}
            <circle
                stroke="#2196f3" // Blue color
                fill="transparent"
                strokeWidth={strokeWidth / 2} // Made inner circle foreground thinner
                strokeDasharray={innerCircumference + ' ' + innerCircumference}
                strokeDashoffset={innerOffset}
                r={innerRadius}
                cx={size / 2}
                cy={size / 2}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.35s'
                }}
            />

            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                fill="#ffffff" // White text color
                stroke="#ffffff" // White stroke for text
                strokeWidth="0.5px" // Thinner stroke for text
                dy=".3em"
            >
                {`${percent.toFixed(2)}%`}
            </text>
        </svg>
  );
};

export default CircularProgressSVG;

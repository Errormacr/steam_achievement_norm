import React from 'react';
import '../scss/ProgressRad.scss';

interface ProgressProps extends React.HTMLAttributes < HTMLDivElement > {
    'data-progress' ?: string;
    'SizeVnu': string;
    'SizeVne': string;
}

const ProgressRad : React.FC < ProgressProps > = ({
  'data-progress': progress,
  SizeVnu: sizeVNu,
  SizeVne: sizeVN,
  ...rest
}) => {
  const progressValue = +progress || 0;
  const progressSec = progressValue === 100
    ? 100
    : (progressValue * 100) % 100;
  const rotation = (progressValue / 100) * 360;
  const rotationSec = (progressSec / 100) * 360;
  const parsedProgress = parseFloat(progress);
  const progressStyle : React.CSSProperties & {
        '--progress' ?: string;
        '--progress-float' ?: string;
        '--length' ?: string;
        '--heigth' ?: string;
    } = {
      '--progress': `${rotation}deg`,
      '--progress-float': `${rotationSec}deg`,
      '--length': `${sizeVN}`,
      '--heigth': `${sizeVNu}`
    };
  const string = `${parsedProgress.toFixed(2)}%`;

  return (
        <div
            className="progress_rad"
            {...rest}
            data-progress={string}
            style={progressStyle}></div>
  );
};

export default ProgressRad;

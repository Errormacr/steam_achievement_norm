import React from "react";

interface ProgressProps extends React.HTMLAttributes < HTMLDivElement > {
    'data-progress' ?: string;
    'main' ?: boolean;
}

const ProgressRad : React.FC < ProgressProps > = ({
    'data-progress': progress,
    'main': main,
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
    } = {
        '--progress': `${rotation}deg`,
        '--progress-float': `${rotationSec}deg`,
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

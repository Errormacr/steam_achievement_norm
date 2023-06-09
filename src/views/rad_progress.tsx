import {HTMLAttributes} from "react";

interface ProgressProps extends HTMLAttributes < HTMLDivElement > {
    'data-progress' ?: string;
}

const ProgressRad : React.FC < ProgressProps > = ({
    'data-progress': progress,
    ...rest
}) => {
    const progressValue = parseInt(progress || '0');
    const progressSec = parseInt(progress) == 100
        ? 100
        : parseFloat(progress) * 100 / 1 % 100;
    const rotation = (progressValue / 100) * 360;
    const rotationSec = (progressSec / 100) * 360;
    const progressStyle : React.CSSProperties & {
        '--progress' ?: string;
        '--progress-float' ?: string
    } = {
        '--progress': `${rotation}deg`,
        '--progress-float': `${rotationSec}deg`
    };
    return (
        <div
            className="progress_rad"
            {...rest}
            data-progress={`${parseFloat(progress).toFixed(2)}%`}
            style={progressStyle}></div>

    );
};

export default ProgressRad;

import React from 'react';

type ClearButtonProps = {
    onClick: () => void;
    text: string;
    id:string;
};

const ClearButton : React.FC < ClearButtonProps > = ({onClick, text, id}) => {
    return (
        <button type="button" id={id} className="gameButton" onClick={onClick}>
            {text}
        </button>
    );
};

export default ClearButton;
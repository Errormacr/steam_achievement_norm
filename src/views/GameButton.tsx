import React from 'react';
import './scss/GameButton.scss';

type ButtonProps = {
    onClick: (event : any) => void;
    additionalClass?: string;
    id: string;
    text: string;
};

const GameButton : React.FC < ButtonProps > = ({ onClick, additionalClass, id, text }) => {
  return (
        <button className={`gameButton ${additionalClass}`} id={id} onClick={onClick}>{text}</button>
  );
};

export default GameButton;

import React from 'react';
import '../styles/scss/GameButton.scss';

type ButtonProps = {
    onClick: (event: unknown) => void;
    additionalClass?: string;
    id: string;
    text: string;
    title?: string;
    style?: React.CSSProperties;
};

const GameButton: React.FC<ButtonProps> = ({ onClick, additionalClass, id, text, title, style }) => {
  return (
    <button
      className={`gameButton ${additionalClass || ''}`}
      id={id}
      onClick={onClick}
      title={title}
      style={style}
    >
      {text}
    </button>
  );
};

export default GameButton;

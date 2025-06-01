import React from 'react';
import '../scss/IdKeyInput.scss';

type InputProps = {
    onChange: (event: unknown) => void;
    placeholder: string;
    value?: string;
};

const IdKeyInput: React.FC<InputProps> = ({ onChange, placeholder, value }) => {
  return (
    <input
      placeholder={placeholder}
      className="idKeyInput"
      value={value !== '' ? value : ''}
      id="key"
      onChange={onChange}
    />
  );
};

export default IdKeyInput;

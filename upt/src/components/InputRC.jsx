import React from 'react';
import PropTypes from 'prop-types';
import './style/input-rc.css'; 

const InputRC = ({ name, type = 'text', value, onChange, placeholder, disabled, className }) => {
  return (
    <input
      name={name} 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      disabled={disabled} 
      className={`input ${className}`}
    />
  );
};

// Пропсы по умолчанию
InputRC.defaultProps = {
  type: 'text',
  disabled: false,
  placeholder: '',
  className: '',
};

// Валидация пропсов
InputRC.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel']),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default InputRC;
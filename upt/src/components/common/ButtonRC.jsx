import React from 'react';
import PropTypes from 'prop-types';
import './style/button-rc.css'; 

const ButtonRC = ({ type = 'button', onClick, children, disabled, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`} 
    >
      {children}
    </button>
  );
};

ButtonRC.defaultProps = {
  type: 'button',
  disabled: false,
  className: '',
};

ButtonRC.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ButtonRC;
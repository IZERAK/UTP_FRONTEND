import React from 'react';
import PropTypes from 'prop-types';
import "./style/label-rc.css"

const LabelRC = ({ htmlFor, children, className }) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};

// Пропсы по умолчанию
LabelRC.defaultProps = {
  className: '',
};

// Валидация пропсов
LabelRC.propTypes = {
  htmlFor: PropTypes.string.isRequired, // Атрибут for обязателен
  children: PropTypes.node.isRequired, // Текст метки обязателен
  className: PropTypes.string, // Дополнительные классы
};

export default LabelRC;
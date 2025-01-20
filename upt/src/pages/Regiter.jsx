import React, { useState } from 'react';
import ButtonRC from "../components/common/ButtonRC";
import InputRC from "../components/common/InputRC";
import LabelRC from "../components/common/LabelRC";
import TitleRC from "../components/common/TitleRC"; // Импортируем TitleRC
import './style/register.css';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные формы:', formData); // Выводим данные в консоль
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Используем TitleRC вместо h2 */}
        <TitleRC text="Регистрация" className="register-title" />

        {/* Поле для почты */}
        <LabelRC htmlFor="email" className="register-label">
          Почта (ваш логин):
        </LabelRC>
        <InputRC
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите вашу почту"
          className="register-input"
        />

        {/* Поле для пароля */}
        <LabelRC htmlFor="password" className="register-label">
          Пароль:
        </LabelRC>
        <InputRC
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          className="register-input"
        />

        {/* Поле для подтверждения пароля */}
        <LabelRC htmlFor="confirmPassword" className="register-label">
          Подтверждение:
        </LabelRC>
        <InputRC
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Повторите пароль"
          className="register-input"
        />

        {/* Кнопка "Создать аккаунт" */}
        <ButtonRC type="submit" className="register-primary-button">
          Создать аккаунт
        </ButtonRC>

        {/* Кнопка "Войти" */}
        <ButtonRC
          type="button"
          className="register-secondary-button"
        >
          Войти
        </ButtonRC>
      </form>
    </div>
  );
};

export default RegistrationPage;
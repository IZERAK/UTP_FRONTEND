import React, { useState } from 'react';
import ButtonRC from './components/ButtonRC/ButtonRC';
import InputRC from './components/InputRC/InputRC';
import LabelRC from './components/LabelRC/LabelRC';
import './style/register.css'; // Подключаем стили

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
    console.log('Данные формы:', formData); // Пока просто выводим данные в консоль
  };

  const handleLoginRedirect = () => {
    console.log('Переход на страницу входа');
    // Здесь можно добавить логику перехода на страницу входа
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Регистрация</h2>

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
          onClick={handleLoginRedirect}
          className="register-secondary-button"
        >
          Войти
        </ButtonRC>
      </form>
    </div>
  );
};

export default RegistrationPage;
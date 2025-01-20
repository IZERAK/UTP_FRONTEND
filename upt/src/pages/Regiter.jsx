import React, { useState } from "react";
import ButtonRC from "../components/ButtonRC"
import InputRC from "../components/InputRC"
import LabelRC from "../components/LabelRC"
import TitleRC from "../components/TitleRC"
import "../assets/styles/register.css"

const RegistrationPage = () => {
  // Состояния для полей ввода
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Обработчики изменений полей ввода
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Обработчик кнопки "Создать аккаунт"
  const handleCreateAccount = () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    // Здесь можно добавить логику для регистрации
    console.log("Регистрация:", { email, password });
    alert("Аккаунт успешно создан!");
  };

  // Обработчик кнопки "Войти"
  const handleLogin = () => {
    // Здесь можно добавить логику для перехода на страницу входа
    console.log("Переход на страницу входа");
  };

  return (
    <div className="registration-container">
      {/* Заголовок */}
      <TitleRC text="Регистрация" className="registration-title" />

      {/* Форма регистрации */}
      <form className="registration-form">
        {/* Поле для ввода почты */}
        <LabelRC htmlFor="email">Почта (ваш логин)</LabelRC>
        <InputRC
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Введите почту"
        />

        {/* Поле для ввода пароля */}
        <LabelRC htmlFor="password">Пароль</LabelRC>
        <InputRC
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Введите пароль"
        />

        {/* Поле для подтверждения пароля */}
        <LabelRC htmlFor="confirmPassword">Подтвердите пароль</LabelRC>
        <InputRC
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Повторите пароль"
        />

        {/* Контейнер с кнопками */}
        <div className="button-container">
          <ButtonRC onClick={handleCreateAccount} className="primary-button">
            Создать аккаунт
          </ButtonRC>
          <ButtonRC onClick={handleLogin} className="secondary-button">
            Войти
          </ButtonRC>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Импорт для навигации
import "../styles/LoginRegister.css";
import { login, register } from "../services/api";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const navigate = useNavigate(); // Хук для навигации

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await login(formData.email, formData.password);
        alert("Вы вошли в систему!");
        console.log("Login response:", response);
        navigate("/home"); // Переход на главную страницу
      } catch (error) {
        alert("Ошибка входа: " + (error.response?.data || error.message));
      }
    } else {
      try {
        const response = await register(
          formData.email,
          formData.username,
          formData.password
        );
        alert("Регистрация успешна!");
        console.log("Register response:", response);
        navigate("/home"); // Переход на главную страницу
      } catch (error) {
        alert("Ошибка регистрации: " + (error.response?.data || error.message));
      }
    }
  };

  return (
    <div className="login-register">
      <h1>ScherBook</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Введите имя пользователя"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? "Создать аккаунт" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;

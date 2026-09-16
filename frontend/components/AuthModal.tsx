"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    closeAuth,
    authMode,
    setAuthMode,
    authMessage,
    loginUser,
    registerUser,
  } = useMarketplace();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLocalError("");
    closeAuth();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!/.+@.+\..+/.test(email) || !password) {
      setLocalError("Заполните email и пароль");
      return;
    }
    const success = loginUser(email, password);
    if (!success) {
      setLocalError("Неверный email или пароль");
    }
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (name.trim().length < 2) {
      setLocalError("Введите имя");
      return;
    }
    if (!/.+@.+\..+/.test(email)) {
      setLocalError("Введите корректный email");
      return;
    }
    if (password.length < 6) {
      setLocalError("Пароль, минимум 6 символов");
      return;
    }
    const res = registerUser(name, email, password);
    if (!res.success) {
      setLocalError(res.msg || "Ошибка регистрации");
    }
  };

  const activeError = localError || authMessage;

  return (
    <div
      className="auth-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="auth-box">
        <div className="auth-head">
          <b id="authTitle">
            {authMode === "login" ? "Вход в аккаунт" : "Регистрация"}
          </b>
          <button
            className="auth-close"
            id="authClose"
            aria-label="Закрыть"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="auth-tabs">
          <button
            className={authMode === "login" ? "active" : ""}
            onClick={() => {
              setAuthMode("login");
              setLocalError("");
            }}
            type="button"
          >
            Вход
          </button>
          <button
            className={authMode === "reg" ? "active" : ""}
            onClick={() => {
              setAuthMode("reg");
              setLocalError("");
            }}
            type="button"
          >
            Регистрация
          </button>
        </div>

        {authMode === "login" ? (
          <form className="ck-form" onSubmit={handleLoginSubmit} noValidate>
            <label htmlFor="liEmail">Email</label>
            <input
              id="liEmail"
              type="email"
              placeholder="ivan@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="liPass">Пароль</label>
            <input
              id="liPass"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn--w"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Войти
            </button>
          </form>
        ) : (
          <form className="ck-form" onSubmit={handleRegSubmit} noValidate>
            <label htmlFor="rgName">Имя</label>
            <input
              id="rgName"
              placeholder="Иван Печаткин"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="rgEmail">Email</label>
            <input
              id="rgEmail"
              type="email"
              placeholder="ivan@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="rgPass">Пароль (минимум 6 символов)</label>
            <input
              id="rgPass"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn--w"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Создать аккаунт
            </button>
          </form>
        )}

        {activeError && <p className="auth-msg err">{activeError}</p>}

        <p className="auth-note">
          Прототип: аккаунты хранятся локально в браузере.
          <br />В продакшене авторизация пойдёт через backend (API + хеширование
          паролей).
        </p>
      </div>
    </div>
  );
};

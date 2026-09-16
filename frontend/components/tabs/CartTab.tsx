"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { COUNTRIES } from "@/data/countries";
import { Order } from "@/types";

export const CartTab: React.FC = () => {
  const {
    cartItems,
    subtotal,
    updateCartQty,
    removeFromCart,
    fmt,
    switchTab,
    user,
    profile,
    updateProfile,
    openAuth,
    showToast,
    addOrder,
    lastOrder,
  } = useMarketplace();

  const [viewState, setViewState] = useState<"cart" | "checkout" | "done">(
    "cart",
  );
  const [shipCountryCode, setShipCountryCode] = useState(
    profile.country || "RU",
  );
  const [shippingMethod, setShippingMethod] = useState<"std" | "exp">("std");

  // Checkout Form States
  const [recipientName, setRecipientName] = useState(profile.name || "");
  const [recipientEmail, setRecipientEmail] = useState(profile.email || "");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Карта" | "СБП" | "Крипта"
  >("Карта");

  // Errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const country = COUNTRIES[shipCountryCode] || COUNTRIES.RU;
  const isExp = shippingMethod === "exp";
  const baseShippingCost = Math.round(country.ship * (isExp ? 1.9 : 1));
  const isFree = shipCountryCode === "RU" && subtotal >= 5000;
  const shippingCost = isFree ? 0 : baseShippingCost;
  const totalAmount = subtotal + shippingCost;

  const handleStartCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Корзина пуста, добавьте товары");
      return;
    }
    if (!user) {
      openAuth("login", "Войдите или создайте аккаунт, чтобы оформить заказ");
      return;
    }
    setRecipientName(profile.name);
    setRecipientEmail(profile.email);
    setViewState("checkout");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {
      name: recipientName.trim().length < 2,
      email: !/.+@.+\..+/.test(recipientEmail),
      city: city.trim().length < 2,
      address: address.trim().length < 4,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) {
      showToast("Заполните обязательные поля *");
      return;
    }

    const letters = ["А", "Б", "В", "Г", "Д"];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const orderNum = `LM-${Math.floor(1000 + Math.random() * 9000)}-${randomLetter}`;
    const pts = Math.round(totalAmount / 10);
    const totalItemsCount = cartItems.reduce((acc, it) => acc + it.qty, 0);

    const order: Order = {
      num: orderNum,
      date: new Date().toLocaleDateString("ru-RU"),
      items: totalItemsCount,
      lines: cartItems.map((it) => ({
        id: it.product.id,
        name: it.product.name,
      })),
      total: totalAmount,
      pts,
      country: `${country.code} • ${country.name}`,
      days: country.days,
      pay: paymentMethod,
    };

    updateProfile({
      name: recipientName.trim(),
      email: recipientEmail.trim(),
      country: shipCountryCode,
    });

    addOrder(order);
    setViewState("done");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <section className="panel active" id="tab-cart">
      <div className="sec-head" style={{ marginTop: "6px" }}>
        <h2 className="sec-title">
          Корзина <em>покупателя</em>
        </h2>
        <span className="sec-note" id="cartNote">
          ПОЗИЦИЙ: {cartItems.length}
        </span>
      </div>

      {/* 1. Cart View */}
      {viewState === "cart" && (
        <div id="cartView">
          {cartItems.length === 0 ? (
            <div className="empty">
              <span className="stamp stamp--green">Пусто</span>
              <p>Корзина легальна, но пуста. Исправим?</p>
              <button
                className="btn"
                onClick={() => switchTab("catalog")}
                type="button"
              >
                В каталог
              </button>
            </div>
          ) : (
            <div className="cart-grid">
              <div id="cartLines">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="cline">
                    <img
                      src={`https://picsum.photos/seed/${product.seed}/180/180`}
                      alt={product.name}
                    />
                    <div>
                      <h5>{product.name}</h5>
                      <span className="mono">
                        {product.sku} • {product.cat.toUpperCase()}
                      </span>
                      <div className="qty">
                        <button
                          onClick={() => updateCartQty(product.id, -1)}
                          aria-label="Меньше"
                          type="button"
                        >
                          −
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() => updateCartQty(product.id, 1)}
                          aria-label="Больше"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cline-right">
                      <span className="cline-price">
                        {fmt(product.price * qty)}
                      </span>
                      <button
                        className="cline-del"
                        onClick={() => removeFromCart(product.id)}
                        type="button"
                      >
                        ✕ УДАЛИТЬ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary">
                <h3>Итог</h3>
                <div className="sum-row">
                  <span>Товары</span>
                  <span id="sumSub">{fmt(subtotal)}</span>
                </div>

                <label className="sum-label" htmlFor="shipCountry">
                  Страна доставки
                </label>
                <select
                  className="select"
                  id="shipCountry"
                  style={{ width: "100%" }}
                  value={shipCountryCode}
                  onChange={(e) => setShipCountryCode(e.target.value)}
                >
                  {Object.entries(COUNTRIES).map(([code, c]) => (
                    <option key={code} value={code}>
                      {c.code} • {c.name} • {c.days} дн.
                    </option>
                  ))}
                </select>

                <label className="sum-label">Способ доставки</label>
                <div className="radios">
                  <input
                    type="radio"
                    name="dm"
                    id="dmStd"
                    value="std"
                    checked={shippingMethod === "std"}
                    onChange={() => setShippingMethod("std")}
                  />
                  <label htmlFor="dmStd">Стандарт</label>
                  <input
                    type="radio"
                    name="dm"
                    id="dmExp"
                    value="exp"
                    checked={shippingMethod === "exp"}
                    onChange={() => setShippingMethod("exp")}
                  />
                  <label htmlFor="dmExp">Экспресс ×1.9</label>
                </div>

                <div className="sum-row" style={{ marginTop: "12px" }}>
                  <span>Доставка</span>
                  <span id="sumShip">
                    {shippingCost === 0 ? (
                      <span className="free">Бесплатно ✓</span>
                    ) : (
                      fmt(shippingCost)
                    )}
                  </span>
                </div>

                <div className="sum-total">
                  <span>Итого</span>
                  <span id="sumTotal">{fmt(totalAmount)}</span>
                </div>

                <button
                  className="btn btn--w"
                  id="toCheckout"
                  style={{ marginTop: "18px" }}
                  onClick={handleStartCheckout}
                  type="button"
                >
                  Оформить заказ →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Checkout View */}
      {viewState === "checkout" && (
        <div id="checkoutView">
          <div className="cart-grid">
            <form
              className="ck-form"
              id="ckForm"
              onSubmit={handleCheckoutSubmit}
              noValidate
            >
              <label htmlFor="fName">Имя получателя *</label>
              <input
                id="fName"
                placeholder="Иван Печаткин"
                className={errors.name ? "err" : ""}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />

              <label htmlFor="fEmail">Email *</label>
              <input
                id="fEmail"
                type="email"
                placeholder="ivan@example.com"
                className={errors.email ? "err" : ""}
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />

              <div className="row2">
                <div>
                  <label htmlFor="fCountry">Страна *</label>
                  <select
                    id="fCountry"
                    className="select"
                    style={{ width: "100%" }}
                    value={shipCountryCode}
                    onChange={(e) => setShipCountryCode(e.target.value)}
                  >
                    {Object.entries(COUNTRIES).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.code} • {c.name} • {c.days} дн.
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fCity">Город *</label>
                  <input
                    id="fCity"
                    placeholder="Белград"
                    className={errors.city ? "err" : ""}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="fAddr">Адрес *</label>
              <input
                id="fAddr"
                placeholder="ул. Легальная, д. 1"
                className={errors.address ? "err" : ""}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label>Оплата</label>
              <div className="radios">
                <input
                  type="radio"
                  name="pay"
                  id="pCard"
                  value="Карта"
                  checked={paymentMethod === "Карта"}
                  onChange={() => setPaymentMethod("Карта")}
                />
                <label htmlFor="pCard">Карта</label>
                <input
                  type="radio"
                  name="pay"
                  id="pSbp"
                  value="СБП"
                  checked={paymentMethod === "СБП"}
                  onChange={() => setPaymentMethod("СБП")}
                />
                <label htmlFor="pSbp">СБП</label>
                <input
                  type="radio"
                  name="pay"
                  id="pCr"
                  value="Крипта"
                  checked={paymentMethod === "Крипта"}
                  onChange={() => setPaymentMethod("Крипта")}
                />
                <label htmlFor="pCr">Криптовалюта</label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn btn--dim"
                  id="backToCart"
                  onClick={() => setViewState("cart")}
                >
                  ← Назад
                </button>
                <button type="submit" className="btn" style={{ flex: 1 }}>
                  Подтвердить заказ
                </button>
              </div>
            </form>

            <div className="summary" style={{ position: "static" }}>
              <h3>Сводка</h3>
              <div id="ckLines">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="sum-row">
                    <span>
                      {product.name} × {qty}
                    </span>
                    <span>{fmt(product.price * qty)}</span>
                  </div>
                ))}
              </div>
              <div className="sum-row">
                <span>Доставка</span>
                <span id="ckShip">
                  {shippingCost === 0 ? (
                    <span className="free">Бесплатно ✓</span>
                  ) : (
                    fmt(shippingCost)
                  )}
                </span>
              </div>
              <div className="sum-total">
                <span>Итого</span>
                <span id="ckTotal">{fmt(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Certificate / Done View */}
      {viewState === "done" && lastOrder && (
        <div id="doneView">
          <div className="cert">
            <span className="stamp stamp--green">Заказ принят</span>
            <h2>Сертификат легальности</h2>
            <p className="num" id="certNum">
              № {lastOrder.num}
            </p>
            <div className="cert-lines" id="certLines">
              <div>
                <span>Получатель</span>
                <b>{recipientName}</b>
              </div>
              <div>
                <span>Страна</span>
                <b>{lastOrder.country}</b>
              </div>
              <div>
                <span>Товаров</span>
                <b>{lastOrder.items} шт.</b>
              </div>
              <div>
                <span>Доставка</span>
                <b>{lastOrder.days} дн.</b>
              </div>
              <div>
                <span>Оплата</span>
                <b>{lastOrder.pay}</b>
              </div>
              <div>
                <span>Итог</span>
                <b>{fmt(lastOrder.total)}</b>
              </div>
              <div>
                <span>Претензий</span>
                <b style={{ color: "var(--green)" }}>0 ✓</b>
              </div>
            </div>
            <p
              className="mono"
              style={{
                fontSize: "12px",
                color: "var(--green)",
                letterSpacing: "0.08em",
                marginBottom: "22px",
              }}
              id="certPts"
            >
              +{lastOrder.pts} очков легальности на карту
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                onClick={() => {
                  setViewState("cart");
                  switchTab("profile");
                }}
                type="button"
              >
                В профиль
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  setViewState("cart");
                  switchTab("home");
                }}
                type="button"
              >
                На главную
              </button>
            </div>
            <small>
              Документ в двух экземплярах: один вам, второй в архив.
              <br />
              Претензий: 0.
            </small>
          </div>
        </div>
      )}
    </section>
  );
};

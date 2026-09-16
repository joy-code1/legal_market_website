"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { COUNTRIES } from "@/data/countries";
import { PM_ITEMS } from "@/data/constants";
import { CurrencyType } from "@/types";
import { Icon } from "../icons/Icon";

export const ProfileTab: React.FC = () => {
  const {
    user,
    profile,
    updateProfile,
    orders,
    reviews,
    addReview,
    notifs,
    markNotifRead,
    clearNotifs,
    chats,
    lang,
    setLang,
    currency,
    setCurrency,
    fmt,
    openAuth,
    logoutUser,
    switchTab,
    showToast,
    openSubpage,
  } = useMarketplace();

  const [activeMenuKey, setActiveMenuKey] = useState<string>("orders");

  // Settings State
  const [settingsName, setSettingsName] = useState(profile.name || "");
  const [settingsEmail, setSettingsEmail] = useState(profile.email || "");
  const [settingsCountry, setSettingsCountry] = useState(
    profile.country || "RU",
  );
  const [settingsCurrency, setSettingsCurrency] =
    useState<CurrencyType>(currency);

  // Seller State
  const [sellerStoreName, setSellerStoreName] = useState("");

  if (!user) {
    return (
      <section className="panel active" id="tab-profile">
        <div className="sec-head" style={{ marginTop: "6px" }}>
          <h2 className="sec-title">
            Профиль <em>покупателя</em>
          </h2>
          <span className="sec-note">карта легального покупателя</span>
        </div>

        <div id="pfGuest">
          <div className="empty">
            <span className="stamp stamp--green">Нужен вход</span>
            <p>
              Войдите или создайте аккаунт, появятся карта покупателя, очки и
              история заказов.
              <br />
              Оформление заказов доступно только авторизованным покупателям.
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
                onClick={() => openAuth("login")}
                type="button"
              >
                Войти
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => openAuth("reg")}
                type="button"
              >
                Создать аккаунт
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const countryInfo = COUNTRIES[profile.country || "RU"] || COUNTRIES.RU;
  const totalGoodsPurchased = orders.reduce((sum, o) => sum + o.items, 0);
  const unreadNotifs = notifs.filter((n) => !n.read).length;

  const purchasedProducts: { id: number; name: string }[] = [];
  orders.forEach((o) => {
    (o.lines || []).forEach((l) => {
      if (!purchasedProducts.find((x) => x.id === l.id)) {
        purchasedProducts.push(l);
      }
    });
  });
  const reviewedIds = new Set(reviews.map((r) => r.id));
  const canReview = purchasedProducts.filter((l) => !reviewedIds.has(l.id));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: settingsName.trim(),
      email: settingsEmail.trim(),
      country: settingsCountry,
    });
    setCurrency(settingsCurrency);
    showToast("✓ Профиль сохранён");
  };

  const handleSellerSubmit = () => {
    if (sellerStoreName.trim().length < 2) {
      showToast("Укажите название магазина");
      return;
    }
    showToast("✓ Заявка отправлена! Юристы свяжутся с вами.");
    setSellerStoreName("");
  };

  const handleAddDemoReview = (prod: { id: number; name: string }) => {
    addReview({
      id: prod.id,
      name: prod.name,
      text: "Отличный товар! Всё легально и быстро.",
      rating: 5,
      date: new Date().toLocaleDateString("ru-RU"),
    });
  };

  return (
    <section className="panel active" id="tab-profile">
      <div className="sec-head" style={{ marginTop: "6px" }}>
        <h2 className="sec-title">
          Профиль <em>покупателя</em>
        </h2>
        <span className="sec-note">карта легального покупателя</span>
      </div>

      <div id="pfAuthed">
        <div className="pf-top">
          {/* Member Card */}
          <div className="mcard">
            <div className="mcard-top">
              <span className="mcard-brand">ЛЕГАЛЬНО.МАРКЕТ</span>
              <span className="stamp">Легален</span>
            </div>
            <div className="mcard-name" id="cardName">
              {profile.name || "Покупатель"}
            </div>
            <div className="mcard-num" id="cardNum">
              № {profile.cardNo || "LM-24-000000"}
            </div>
            <div className="mcard-pts">
              ОЧКИ ЛЕГАЛЬНОСТИ: <b id="cardPts">{profile.pts}</b>
            </div>
          </div>

          {/* Stats */}
          <div className="pstats" id="pstats">
            <div className="pstat">
              <b>{orders.length}</b>
              <span>Заказов</span>
            </div>
            <div className="pstat">
              <b>{totalGoodsPurchased}</b>
              <span>Товаров</span>
            </div>
            <div className="pstat">
              <b>{profile.pts}</b>
              <span>Очков</span>
            </div>
            <div className="pstat">
              <b>{countryInfo.code}</b>
              <span>Страна</span>
            </div>
          </div>
        </div>

        <div className="pf-layout">
          {/* Profile Sidebar Menu */}
          <nav className="pm-menu" id="pmMenu" aria-label="Меню профиля">
            {PM_ITEMS.map((item) => {
              const isActive = activeMenuKey === item.key;
              const hasBadge = item.key === "notif" && unreadNotifs > 0;
              return (
                <button
                  key={item.key}
                  className={`pm-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveMenuKey(item.key)}
                  type="button"
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                  {hasBadge && <span className="pm-badge">{unreadNotifs}</span>}
                </button>
              );
            })}

            <button
              className="pm-item pm-item--red"
              onClick={logoutUser}
              type="button"
            >
              <Icon name="exit" size={19} />
              <span>Выйти из аккаунта</span>
            </button>
          </nav>

          {/* Profile Content Pane */}
          <div className="pm-content" id="pmContent">
            {/* 1. Orders */}
            {activeMenuKey === "orders" && (
              <>
                <h3 className="pm-h">Мои заказы</h3>
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <div key={o.num} className="order">
                      <span
                        className="stamp stamp--green"
                        style={{ fontSize: "10px" }}
                      >
                        Выполнен
                      </span>
                      <div>
                        <div className="order-num">{o.num}</div>
                        <div className="order-meta">
                          {o.date} • {o.items} шт. • {o.country} • {o.days} дн.
                        </div>
                      </div>
                      <span className="order-total">{fmt(o.total)}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <span className="stamp stamp--red">Нет заказов</span>
                    <p>История появится после первой покупки.</p>
                    <button
                      className="btn"
                      onClick={() => switchTab("catalog")}
                      type="button"
                    >
                      В каталог
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 2. Reviews */}
            {activeMenuKey === "reviews" && (
              <>
                <h3 className="pm-h">Мои отзывы</h3>
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div key={r.id + r.date} className="review">
                      <q>{r.text}</q>
                      <div className="review-foot">
                        <div>
                          <b>{r.name}</b>
                          <span className="mono">{r.date}</span>
                        </div>
                        <span className="p-rate">
                          <span className="star">
                            <Icon name="star" size={13} />
                          </span>
                          <b>{r.rating}.0</b>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="pm-p">
                    Вы ещё не оставляли отзывов. Купите что-нибудь легальное и
                    поделитесь мнением.
                  </p>
                )}

                {canReview.length > 0 && (
                  <>
                    <h3 className="pm-h" style={{ marginTop: "18px" }}>
                      Оцените купленное
                    </h3>
                    {canReview.map((prod) => (
                      <div key={prod.id} className="pm-row">
                        <div style={{ flex: 1 }}>
                          <b>{prod.name}</b>
                        </div>
                        <button
                          className="btn btn--sm"
                          onClick={() => handleAddDemoReview(prod)}
                          type="button"
                        >
                          Оставить отзыв
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* 3. Seller */}
            {activeMenuKey === "seller" && (
              <>
                <h3 className="pm-h">Стать продавцом</h3>
                <p className="pm-p">
                  Хотите продавать на ЛЕГАЛЬНО.МАРКЕТ? Мы проверим каждый ваш
                  товар на легальность — дважды. Комиссия платформы — 5%.
                </p>
                <label className="sum-label" htmlFor="sellerName">
                  Название магазина
                </label>
                <input
                  className="select"
                  style={{ width: "100%" }}
                  id="sellerName"
                  placeholder="ИП Печаткин «Всё легально»"
                  value={sellerStoreName}
                  onChange={(e) => setSellerStoreName(e.target.value)}
                />
                <button
                  className="btn"
                  id="sellerBtn"
                  style={{ marginTop: "14px" }}
                  onClick={handleSellerSubmit}
                  type="button"
                >
                  Отправить заявку
                </button>
              </>
            )}

            {/* 4. Chats */}
            {activeMenuKey === "chats" && (
              <>
                <h3 className="pm-h">Мои чаты</h3>
                {chats.map((c, i) => (
                  <div key={i} className="pm-row">
                    <Icon name="chat" size={20} />
                    <div style={{ flex: 1 }}>
                      <b>{c.name}</b>
                      <span className="sub">{c.last}</span>
                    </div>
                    <button
                      className="btn btn--sm btn--dim"
                      onClick={() =>
                        showToast("Демо: переписка появится в продакшене")
                      }
                      type="button"
                    >
                      Открыть
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* 5. Notifications */}
            {activeMenuKey === "notif" && (
              <>
                <h3 className="pm-h">Уведомления</h3>
                {notifs.length > 0 ? (
                  <>
                    {notifs.map((n) => (
                      <button
                        key={n.id}
                        className="pm-row"
                        style={{ width: "100%", textAlign: "left" }}
                        onClick={() => markNotifRead(n.id)}
                        type="button"
                      >
                        {!n.read && <span className="dot-unread" />}
                        <div style={{ flex: 1 }}>
                          <b>{n.text}</b>
                          <span className="sub">{n.date}</span>
                        </div>
                      </button>
                    ))}
                    <button
                      className="btn btn--dim btn--sm"
                      id="notifClear"
                      style={{ marginTop: "6px" }}
                      onClick={clearNotifs}
                      type="button"
                    >
                      Очистить всё
                    </button>
                  </>
                ) : (
                  <p className="pm-p">Пока тихо. Как у юристов.</p>
                )}
              </>
            )}

            {/* 6. Settings */}
            {activeMenuKey === "settings" && (
              <>
                <h3 className="pm-h">Настройки</h3>
                <form
                  className="ck-form"
                  onSubmit={handleSaveSettings}
                  noValidate
                >
                  <label htmlFor="pfName">Имя</label>
                  <input
                    id="pfName"
                    placeholder="Как к вам обращаться"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                  />

                  <label htmlFor="pfEmail">Email</label>
                  <input
                    id="pfEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                  />

                  <label htmlFor="pfCountry">Страна по умолчанию</label>
                  <select
                    id="pfCountry"
                    className="select"
                    style={{ width: "100%" }}
                    value={settingsCountry}
                    onChange={(e) => setSettingsCountry(e.target.value)}
                  >
                    {Object.entries(COUNTRIES).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.code} • {c.name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="pfCurrency">Валюта</label>
                  <select
                    id="pfCurrency"
                    className="select"
                    style={{ width: "100%" }}
                    value={settingsCurrency}
                    onChange={(e) =>
                      setSettingsCurrency(e.target.value as CurrencyType)
                    }
                  >
                    <option value="RUB">₽ Рубль</option>
                    <option value="USD">$ Доллар</option>
                    <option value="EUR">€ Евро</option>
                  </select>

                  <button
                    className="btn btn--w"
                    id="pfSaveBtn"
                    type="submit"
                    style={{ marginTop: "18px" }}
                  >
                    Сохранить
                  </button>
                </form>
              </>
            )}

            {/* 7. Language */}
            {activeMenuKey === "lang" && (
              <>
                <h3 className="pm-h">Язык приложения</h3>
                <p className="pm-p">
                  Выберите язык интерфейса. Полный перевод каталога появится в
                  продакшене.
                </p>
                <div className="lang-btns">
                  <button
                    className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                    onClick={() => {
                      setLang("ru");
                      showToast("Язык: русский");
                    }}
                    type="button"
                  >
                    Русский
                  </button>
                  <button
                    className={`lang-btn ${lang === "en" ? "active" : ""}`}
                    onClick={() => {
                      setLang("en");
                      showToast("Language: English (demo)");
                    }}
                    type="button"
                  >
                    English
                  </button>
                </div>
              </>
            )}

            {/* 8. Help */}
            {activeMenuKey === "help" && (
              <>
                <h3 className="pm-h">Справка</h3>
                <p className="pm-p">
                  На телефоне разделы открываются отдельной страницей — кнопка
                  «назад» вернёт вас в профиль.
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    className="btn"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth <= 900
                      ) {
                        openSubpage("faq");
                      } else {
                        switchTab("faq");
                      }
                    }}
                    type="button"
                  >
                    Вопросы и ответы
                  </button>
                  <button
                    className="btn btn--dim"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth <= 900
                      ) {
                        openSubpage("delivery");
                      } else {
                        switchTab("delivery");
                      }
                    }}
                    type="button"
                  >
                    Доставка и таможня
                  </button>
                </div>
              </>
            )}

            {/* 9. Social */}
            {activeMenuKey === "social" && (
              <>
                <h3 className="pm-h">Наша платформа в соцсетях</h3>
                <p className="pm-p">
                  Новости склада, скидки и юридические лайфхаки —
                  подписывайтесь.
                </p>
                <div className="social-grid">
                  {["Telegram", "VK", "YouTube", "X"].map((s) => (
                    <button
                      key={s}
                      className="social-btn"
                      onClick={() =>
                        showToast(`Мы в ${s}: @legalno_market (демо)`)
                      }
                      type="button"
                    >
                      <Icon name="share" size={18} />
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* 10. Contact */}
            {activeMenuKey === "contact" && (
              <>
                <h3 className="pm-h">Связаться с нами</h3>
                <div className="pm-row">
                  <Icon name="mail" size={20} />
                  <div style={{ flex: 1 }}>
                    <b>help@legalno.market</b>
                    <span className="sub">Ответим в течение дня</span>
                  </div>
                  <a
                    className="btn btn--sm btn--dim"
                    href="mailto:help@legalno.market"
                  >
                    Написать
                  </a>
                </div>
                <div className="pm-row">
                  <Icon name="phone" size={20} />
                  <div style={{ flex: 1 }}>
                    <b>8 800 555-ЛЕГАЛЬНО</b>
                    <span className="sub">Круглосуточно и бесплатно</span>
                  </div>
                  <a className="btn btn--sm btn--dim" href="tel:+78005553535">
                    Позвонить
                  </a>
                </div>
                <div className="pm-row">
                  <Icon name="home" size={20} />
                  <div style={{ flex: 1 }}>
                    <b>Москва • Белград • Алматы</b>
                    <span className="sub">Юристы на месте</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

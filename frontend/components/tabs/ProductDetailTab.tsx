"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { PRODUCTS } from "@/data/products";
import { COUNTRIES } from "@/data/countries";
import { ProductCard } from "../ProductCard";
import { Icon } from "../icons/Icon";

export const ProductDetailTab: React.FC = () => {
  const {
    currentProduct,
    switchTab,
    setCategory,
    addToCart,
    favs,
    toggleFav,
    fmt,
    showToast,
    profile,
  } = useMarketplace();

  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [calcCountryCode, setCalcCountryCode] = useState(
    profile.country || "RU",
  );

  if (!currentProduct) {
    return (
      <section className="panel active" id="tab-product">
        <div className="empty">
          <span className="stamp stamp--red">Товар не выбран</span>
          <button
            className="btn"
            onClick={() => switchTab("catalog")}
            type="button"
          >
            В каталог
          </button>
        </div>
      </section>
    );
  }

  const p = currentProduct;
  const isFav = favs.includes(p.id);
  const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const imgs = [p.seed, `${p.seed}-b`, `${p.seed}-c`];

  let similar = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(
    0,
    4,
  );
  if (!similar.length) {
    similar = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
  }

  const calcCountry = COUNTRIES[calcCountryCode] || COUNTRIES.RU;
  const isFreeRu = calcCountryCode === "RU" && p.price * qty >= 5000;
  const shipCost = isFreeRu ? 0 : calcCountry.ship;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      try {
        navigator.clipboard.writeText(window.location.href);
      } catch {}
    }
    showToast("Ссылка на товар скопирована");
  };

  const handleAddToCart = () => {
    addToCart(p.id, qty);
  };

  const maxStock = p.stock > 999 ? 99 : p.stock;

  return (
    <section className="panel active" id="tab-product">
      <div id="productBox">
        {/* Breadcrumbs */}
        <div className="crumbs">
          <button onClick={() => switchTab("home")} type="button">
            Главная
          </button>
          <span className="sep">/</span>
          <button onClick={() => switchTab("catalog")} type="button">
            Каталог
          </button>
          <span className="sep">/</span>
          <button
            onClick={() => {
              setCategory(p.cat);
              switchTab("catalog");
            }}
            type="button"
          >
            {p.cat}
          </button>
          <span className="sep">/</span>
          <span className="cur">{p.name}</span>
        </div>

        <div className="prod-grid">
          {/* Left Column: Gallery */}
          <div>
            <div className="gallery-main">
              <img
                id="pdMain"
                src={`https://picsum.photos/seed/${imgs[activeThumb]}/900/900`}
                alt={p.name}
              />
              {discount > 0 && <span className="p-disc">−{discount}%</span>}
              <button
                className="pg-back"
                onClick={() => switchTab("catalog", true)}
                aria-label="Назад"
                type="button"
              >
                <Icon name="left" size={22} />
              </button>

              <div className="pg-actions">
                <button
                  className={`pg-btn favbtn ${isFav ? "on" : ""}`}
                  onClick={() => toggleFav(p.id)}
                  aria-label="В избранное"
                  type="button"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-7.5-4.7-9.4-9.3C1.2 8 3.2 4.5 6.6 4.5c2 0 3.8 1.2 5.4 3 1.6-1.8 3.4-3 5.4-3 3.4 0 5.4 3.5 4 7.2C19.5 16.3 12 21 12 21z" />
                  </svg>
                </button>
                <button
                  className="pg-btn"
                  onClick={handleShare}
                  aria-label="Поделиться"
                  type="button"
                >
                  <Icon name="share" size={20} />
                </button>
              </div>
            </div>

            <div className="thumbs">
              {imgs.map((s, idx) => (
                <button
                  key={s}
                  className={`thumb ${activeThumb === idx ? "active" : ""}`}
                  onClick={() => setActiveThumb(idx)}
                  type="button"
                >
                  <img src={`https://picsum.photos/seed/${s}/200/150`} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="prod-info">
            <div className="prod-cards">
              <div className="p-card">
                <div className="prod-price-row">
                  <span className="prod-price">{fmt(p.price)}</span>
                  {discount > 0 && (
                    <span className="prod-disc">↓{discount}%</span>
                  )}
                </div>
                {p.old && (
                  <div className="prod-old" style={{ marginTop: "4px" }}>
                    {fmt(p.old)}
                  </div>
                )}
              </div>

              <div className="p-card">
                <div className="warr">
                  <Icon name="shield" size={18} /> Гарантия 30 дней{" "}
                  <span className="arr">›</span>
                </div>
                <h1>{p.name}</h1>
                <div className="p-rate" style={{ margin: "10px 0 0" }}>
                  <span className="star">
                    <Icon name="star" size={13} />
                  </span>
                  <b>{p.rating.toFixed(1)}</b> · {p.rv} оценок
                </div>
                <p className="prod-desc">
                  {p.desc} Прошёл двойную юридическую проверку и допущен к
                  продаже во всех 63 странах доставки.
                </p>
              </div>

              <div className="p-card">
                <label className="sum-label" htmlFor="pdCountry">
                  Рассчитать доставку
                </label>
                <select
                  className="select"
                  id="pdCountry"
                  style={{ width: "100%" }}
                  value={calcCountryCode}
                  onChange={(e) => setCalcCountryCode(e.target.value)}
                >
                  {Object.entries(COUNTRIES).map(([code, c]) => (
                    <option key={code} value={code}>
                      {c.code} • {c.name} • {c.days} дн.
                    </option>
                  ))}
                </select>

                <p className="ship-result">
                  {isFreeRu ? (
                    <>
                      В {calcCountry.name}: <b>{calcCountry.days} дн.</b> •{" "}
                      <b style={{ color: "var(--green)" }}>бесплатно</b> (заказ
                      от 5 000 ₽)
                    </>
                  ) : (
                    <>
                      В {calcCountry.name}: <b>{calcCountry.days} дн.</b> •{" "}
                      <b>{fmt(shipCost)}</b>
                    </>
                  )}
                </p>
              </div>

              <div className="buy-row">
                <div className="qty">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    aria-label="Меньше"
                    type="button"
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() =>
                      setQty((prev) => Math.min(maxStock, prev + 1))
                    }
                    aria-label="Больше"
                    type="button"
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn"
                  onClick={handleAddToCart}
                  style={{ flex: 1, minWidth: "150px" }}
                  type="button"
                >
                  В корзину
                </button>

                <button
                  className={`heart-lg favbtn ${isFav ? "on" : ""}`}
                  onClick={() => toggleFav(p.id)}
                  aria-label="В избранное"
                  type="button"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-7.5-4.7-9.4-9.3C1.2 8 3.2 4.5 6.6 4.5c2 0 3.8 1.2 5.4 3 1.6-1.8 3.4-3 5.4-3 3.4 0 5.4 3.5 4 7.2C19.5 16.3 12 21 12 21z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="legal-box" style={{ marginTop: "16px" }}>
              <span className="stamp stamp--green" style={{ flex: "0 0 auto" }}>
                Легально
              </span>
              <p>
                Товар соответствует законодательству страны отправления и всех
                стран доставки.
                <span className="mono">
                  ПРОТОКОЛ ПРОВЕРКИ № {p.sku}-П • ЗАВЕРЕН ДВАЖДЫ
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="sec-head">
          <h2 className="sec-title">Характеристики</h2>
        </div>
        <table className="spec-table">
          <tbody>
            <tr>
              <td>Артикул</td>
              <td>{p.sku}</td>
            </tr>
            <tr>
              <td>Категория</td>
              <td>{p.cat}</td>
            </tr>
            <tr>
              <td>Происхождение</td>
              <td>{p.origin}</td>
            </tr>
            <tr>
              <td>Наличие</td>
              <td>
                {p.stock > 999
                  ? "В наличии (много)"
                  : `В наличии: ${p.stock} шт.`}
              </td>
            </tr>
            <tr>
              <td>Юридическая проверка</td>
              <td>Пройдена, 2 раза</td>
            </tr>
            <tr>
              <td>Возврат</td>
              <td>30 дней, товар при возврате остаётся легальным</td>
            </tr>
          </tbody>
        </table>

        {/* Reviews */}
        <div className="sec-head">
          <h2 className="sec-title">Отзывы</h2>
          <span className="sec-note">заверено нотариусом</span>
        </div>
        <div className="review">
          <q>
            Заказ пришёл быстро, с двумя печатями и открыткой. {p.name},
            полностью легальный, проверял лично.
          </q>
          <div className="review-foot">
            <div>
              <b>Марина К.</b>
              <span className="mono">ПОРТУГАЛИЯ • ЗАКАЗ № 8841</span>
            </div>
            <span className="stamp stamp--green" style={{ fontSize: "10px" }}>
              Одобрено
            </span>
          </div>
        </div>
        <div className="review">
          <q>
            Упаковано лучше, чем моя прошлая техника. Буду брать ещё, закон
            разрешает.
          </q>
          <div className="review-foot">
            <div>
              <b>Алексей В.</b>
              <span className="mono">КАЗАНЬ • ЗАКАЗ № 7102</span>
            </div>
            <span className="stamp stamp--green" style={{ fontSize: "10px" }}>
              Одобрено
            </span>
          </div>
        </div>

        {/* Similar Products */}
        <div className="sec-head">
          <h2 className="sec-title">
            Похожие <em>товары</em>
          </h2>
        </div>
        <div className="pgrid" id="pdSimilar">
          {similar.map((sp) => (
            <ProductCard key={sp.id} product={sp} />
          ))}
        </div>

        {/* Mobile sticky purchase bar */}
        <div className="buy-bar">
          <button className="btn" onClick={handleAddToCart} type="button">
            В корзину
            <small>Доставка {calcCountry.days} дн.</small>
          </button>
        </div>
      </div>
    </section>
  );
};

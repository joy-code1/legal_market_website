"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { PRODUCTS } from "@/data/products";
import { CAT_ICON } from "@/data/constants";
import { ProductCard } from "../ProductCard";
import { Icon } from "../icons/Icon";

export const HomeTab: React.FC = () => {
  const { switchTab, setCategory, setSort, openSubpage } = useMarketplace();
  const [slideIdx, setSlideIdx] = useState(0);

  const slideCount = 3;

  const handleDeliveryClick = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      openSubpage("delivery");
    } else {
      switchTab("delivery");
    }
  };

  const goSlide = (idx: number) => {
    setSlideIdx((idx + slideCount) % slideCount);
  };

  const handleCircleClick = (cat: string) => {
    setCategory(cat);
    switchTab("catalog");
  };

  const saleProducts = PRODUCTS.filter((p) => p.old).sort((a, b) => {
    const discA = a.old ? 1 - a.price / a.old : 0;
    const discB = b.old ? 1 - b.price / b.old : 0;
    return discB - discA;
  });

  return (
    <section className="panel active" id="tab-home">
      <button
        className="promo-card"
        onClick={handleDeliveryClick}
        type="button"
      >
        <span className="pc-ico">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6h12v10H2zM14 9h4l3 3v4h-7M6.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM17.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z" />
          </svg>
        </span>
        <span style={{ flex: 1, textAlign: "left" }}>
          <b>Бесплатно по РФ от 5 000 ₽</b>
          <span className="pc-sub">
            И доставка в 63 страны — с сертификатом легальности
          </span>
        </span>
        <span className="arr">
          <Icon name="right" size={20} />
        </span>
      </button>

      <div className="slider">
        <div
          className="slides"
          id="slides"
          style={{
            transform: `translateX(-${slideIdx * 100}%)`,
            display: "flex",
            transition: "transform 0.4s ease",
          }}
        >
          <div className="slide slide--green">
            <div>
              <b>Скидки до −25% на легальное</b>
              <span className="sub">
                Лучшие товары недели. Проверено юристами, заверено печатью.
              </span>
            </div>
            <button
              className="btn"
              onClick={() => {
                setSort("disc");
                switchTab("catalog");
              }}
              type="button"
            >
              Смотреть скидки
            </button>
          </div>

          <div className="slide slide--ink">
            <div>
              <b>Бесплатно по РФ от 5 000 ₽</b>
              <span className="sub">
                И доставка в 63 страны, с сертификатом легальности к каждой
                посылке.
              </span>
            </div>
            <button className="btn" onClick={handleDeliveryClick} type="button">
              Условия доставки
            </button>
          </div>

          <div className="slide slide--sand">
            <div>
              <b>Новинки недели на складе</b>
              <span className="sub">
                Свежая партия товаров, одобренных отделом легальности.
              </span>
            </div>
            <button
              className="btn"
              onClick={() => switchTab("catalog")}
              type="button"
            >
              К новинкам
            </button>
          </div>
        </div>

        <button
          className="nav-arrow prev"
          id="slidePrev"
          aria-label="Назад"
          onClick={() => goSlide(slideIdx - 1)}
          type="button"
        >
          <Icon name="left" size={20} />
        </button>
        <button
          className="nav-arrow next"
          id="slideNext"
          aria-label="Вперёд"
          onClick={() => goSlide(slideIdx + 1)}
          type="button"
        >
          <Icon name="right" size={20} />
        </button>

        <div className="dots" id="dots">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              className={`dot ${i === slideIdx ? "active" : ""}`}
              onClick={() => goSlide(i)}
              aria-label={`Слайд ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>

      <div className="sec-head">
        <h2 className="sec-title">Категории</h2>
      </div>

      <div className="cat-circles" id="catCircles">
        {Object.keys(CAT_ICON).map((c) => (
          <button
            key={c}
            className="cat-circle"
            onClick={() => handleCircleClick(c)}
            type="button"
          >
            <span className="cc-ico">
              <Icon name={CAT_ICON[c]} size={26} />
            </span>
            <span className="cc-lbl">{c}</span>
          </button>
        ))}
      </div>

      <div className="sec-head">
        <h2 className="sec-title">
          Рекомендуем <em>вам</em>
        </h2>
        <span className="sec-note" id="homeCount">
          ТОВАРОВ: {PRODUCTS.length}
        </span>
      </div>

      <div className="pgrid" id="homeGrid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="sale-band">
        <div className="sb-head">
          <b>Скидки недели</b>
          <span className="sb-note">Заказывайте выгодно</span>
        </div>
        <div className="sb-sub">
          До −25% на товары, одобренные отделом легальности.
        </div>
        <div className="hscroll" id="saleRow">
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

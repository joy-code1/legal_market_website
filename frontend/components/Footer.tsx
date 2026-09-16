"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { TabType } from "@/types";

export const Footer: React.FC = () => {
  const { switchTab, openSubpage } = useMarketplace();

  const handleTabClick = (t: TabType) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      typeof window !== "undefined" &&
      window.innerWidth <= 900 &&
      (t === "delivery" || t === "faq")
    ) {
      openSubpage(t);
      return;
    }
    switchTab(t);
  };

  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <div className="foot-brand">
            ЛЕГАЛЬНО<span>.МАРКЕТ</span>
          </div>
          <p className="foot-desc">
            Продаём всё, что можно. Ничего, что нельзя. Это вся наша стратегия.
          </p>
          <span
            className="stamp"
            style={{ color: "#9ed3ae", fontSize: "10px" }}
          >
            Проверено ×2
          </span>
        </div>
        <div>
          <h4>Покупателям</h4>
          <a href="#" onClick={handleTabClick("catalog")}>
            Каталог
          </a>
          <a href="#" onClick={handleTabClick("favs")}>
            Избранное
          </a>
          <a href="#" onClick={handleTabClick("cart")}>
            Корзина
          </a>
          <a href="#" onClick={handleTabClick("profile")}>
            Профиль
          </a>
        </div>
        <div>
          <h4>Информация</h4>
          <a href="#" onClick={handleTabClick("delivery")}>
            Доставка и таможня
          </a>
          <a href="#" onClick={handleTabClick("faq")}>
            Вопросы и ответы
          </a>
        </div>
        <div>
          <h4>Контакты</h4>
          <a href="mailto:help@legalno.market">help@legalno.market</a>
          <a href="tel:+78005553535">8 800 555-ЛЕГАЛЬНО</a>
          <span>Москва • Белград • Алматы</span>
          <span>Пн-Вс, всегда в рамках закона</span>
        </div>
      </div>
      <div className="foot-bottom">
        © 2025 ЛЕГАЛЬНО.МАРКЕТ • НЕ ЯВЛЯЕТСЯ ПУБЛИЧНОЙ ОФЕРТОЙ • ВСЕ ТОВАРЫ
        ПРОВЕРЕНЫ ЮРИСТАМИ ДВАЖДЫ
      </div>
    </footer>
  );
};

"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Icon } from "./icons/Icon";

export const BottomNav: React.FC = () => {
  const { tab, switchTab, favs, cartItems } = useMarketplace();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalFavCount = favs.length;

  return (
    <nav className="bottomnav" aria-label="Мобильная навигация">
      <button
        className={tab === "home" ? "active" : ""}
        onClick={() => switchTab("home")}
        type="button"
      >
        <Icon name="home" size={19} />
        Главная
      </button>

      <button
        className={tab === "catalog" || tab === "product" ? "active" : ""}
        onClick={() => switchTab("catalog")}
        type="button"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        Каталог
      </button>

      <button
        className={tab === "favs" ? "active" : ""}
        onClick={() => switchTab("favs")}
        type="button"
      >
        <Icon name="heart" size={19} />
        Избранное
        <span className={`bbadge ${totalFavCount === 0 ? "zero" : ""}`}>
          {totalFavCount}
        </span>
      </button>

      <button
        className={tab === "cart" ? "active" : ""}
        onClick={() => switchTab("cart")}
        type="button"
      >
        <Icon name="cart" size={19} />
        Корзина
        <span className={`bbadge ${totalCartCount === 0 ? "zero" : ""}`}>
          {totalCartCount}
        </span>
      </button>

      <button
        className={tab === "profile" ? "active" : ""}
        onClick={() => switchTab("profile")}
        type="button"
      >
        <Icon name="user" size={19} />
        Профиль
      </button>
    </nav>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { GeoDropdown } from "./GeoDropdown";
import { CatalogDrawer } from "./CatalogDrawer";
import { Icon } from "./icons/Icon";

export const Header: React.FC = () => {
  const {
    tab,
    switchTab,
    selectedCountry,
    search,
    setSearch,
    favs,
    cartItems,
    user,
    profile,
    isCatPanelOpen,
    setCatPanelOpen,
  } = useMarketplace();

  const [isGeoOpen, setIsGeoOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsGeoOpen(false);
        setCatPanelOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setCatPanelOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim().toLowerCase());
    switchTab("catalog");
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalFavCount = favs.length;
  const isShopHidden = ["favs", "cart", "profile", "product"].includes(tab);

  const profileLabel = user ? (profile.name || user).split(" ")[0] : "Профиль";

  return (
    <header
      ref={headerRef}
      id="siteHeader"
      className={`${isScrolled ? "scrolled" : ""} ${isShopHidden ? "shop-hidden" : ""}`}
    >
      <div className="wrap">
        <div
          className="geo-row"
          id="geoRow"
          onClick={() => setIsGeoOpen((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span id="geoName">{selectedCountry.name}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span className="geo-lbl">страна доставки</span>
        </div>

        <div className="head-in">
          <button
            className={`cat-btn ${isCatPanelOpen ? "open" : ""}`}
            id="catBtn"
            aria-expanded={isCatPanelOpen}
            aria-controls="catPanel"
            aria-label="Открыть каталог"
            onClick={() => setCatPanelOpen(!isCatPanelOpen)}
          >
            <svg
              width="18"
              height="18"
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
            <span>Каталог</span>
          </button>

          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchTab("home");
            }}
          >
            ЛЕГАЛЬНО<span>.МАРКЕТ</span>
          </a>

          <form
            className="search-box"
            id="searchForm"
            role="search"
            onSubmit={handleSearchSubmit}
            style={{ display: isShopHidden ? "none" : "flex" }}
          >
            <input
              id="searchInput"
              type="text"
              placeholder="Искать товары и категории"
              autoComplete="off"
              value={searchInput || search}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="search-btn" type="submit">
              Найти
            </button>
          </form>

          <button
            className={`hicon ${tab === "favs" ? "active" : ""}`}
            onClick={() => switchTab("favs")}
            aria-label="Избранное"
          >
            <Icon name="heart" size={22} />
            <span className="lbl">Избранное</span>
            <span className={`pill ${totalFavCount === 0 ? "zero" : ""}`}>
              {totalFavCount}
            </span>
          </button>

          <button
            className={`hicon ${tab === "cart" ? "active" : ""}`}
            onClick={() => switchTab("cart")}
            aria-label="Корзина"
          >
            <Icon name="cart" size={22} />
            <span className="lbl">Корзина</span>
            <span className={`pill ${totalCartCount === 0 ? "zero" : ""}`}>
              {totalCartCount}
            </span>
          </button>

          <button
            className={`hicon ${tab === "profile" ? "active" : ""}`}
            onClick={() => switchTab("profile")}
            aria-label="Профиль"
          >
            <Icon name="user" size={22} />
            <span className="lbl" id="profileLbl">
              {profileLabel}
            </span>
          </button>
        </div>
      </div>

      <GeoDropdown isOpen={isGeoOpen} onClose={() => setIsGeoOpen(false)} />
      <CatalogDrawer
        isOpen={isCatPanelOpen}
        onClose={() => setCatPanelOpen(false)}
      />
    </header>
  );
};

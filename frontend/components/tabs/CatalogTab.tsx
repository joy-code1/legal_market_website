"use client";

import React, { useState, useEffect } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { PRODUCTS } from "@/data/products";
import { CAT_ICON } from "@/data/constants";
import { SortType } from "@/types";
import { ProductCard } from "../ProductCard";
import { Icon } from "../icons/Icon";

export const CatalogTab: React.FC = () => {
  const { category, setCategory, search, setSearch, sort, setSort } =
    useMarketplace();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = Array.from(new Set(PRODUCTS.map((p) => p.cat)));
  const countByCat = (c: string) => PRODUCTS.filter((p) => p.cat === c).length;

  const listMode = isMobile && category === "Все" && !search;

  const discOf = (p: { price: number; old: number | null }) =>
    p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

  const filtered = PRODUCTS.filter((p) => {
    const text = `${p.name} ${p.cat} ${p.sku} ${p.desc}`.toLowerCase();
    const matchesCat = category === "Все" || p.cat === category;
    const matchesSearch = !search || text.includes(search);
    return matchesCat && matchesSearch;
  });

  if (sort === "cheap") filtered.sort((a, b) => a.price - b.price);
  if (sort === "rich") filtered.sort((a, b) => b.price - a.price);
  if (sort === "disc") filtered.sort((a, b) => discOf(b) - discOf(a));
  if (sort === "abc")
    filtered.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  if (sort === "rate") filtered.sort((a, b) => b.rating - a.rating);

  return (
    <section className="panel active" id="tab-catalog">
      <div className="cat-layout">
        {/* Category sidebar */}
        <aside
          className="cat-list"
          id="catList"
          aria-label="Категории"
          style={{ display: isMobile && !listMode ? "none" : "" }}
        >
          <button
            className={`cl-item ${category === "Все" ? "active" : ""}`}
            onClick={() => setCategory("Все")}
            type="button"
          >
            <Icon name="bag" size={20} />
            <span>Все товары</span>
            <span className="cnt">{PRODUCTS.length}</span>
            <span className="chev">
              <Icon name="right" size={16} />
            </span>
          </button>

          {categories.map((c) => (
            <button
              key={c}
              className={`cl-item ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
              type="button"
            >
              <Icon name={CAT_ICON[c] || "box"} size={20} />
              <span>{c}</span>
              <span className="cnt">{countByCat(c)}</span>
              <span className="chev">
                <Icon name="right" size={16} />
              </span>
            </button>
          ))}
        </aside>

        {/* Catalog Main Content */}
        <div
          className="cat-main"
          id="catMain"
          style={{ display: isMobile && listMode ? "none" : "" }}
        >
          {isMobile && !listMode && (
            <button
              className="btn btn--dim btn--sm"
              id="catBack"
              style={{ marginBottom: "12px" }}
              onClick={() => {
                setCategory("Все");
                setSearch("");
              }}
              type="button"
            >
              ← Все категории
            </button>
          )}

          <div className="sec-head" style={{ marginTop: 0 }}>
            <h2 className="sec-title">
              Каталог <em>разрешённого</em>
            </h2>
            <span className="sec-note" id="catCount">
              НАЙДЕНО: {filtered.length} / {PRODUCTS.length}
            </span>
          </div>

          <div className="toolbar">
            <span id="catQuery">
              {search && (
                <button
                  className="chip chip--query"
                  id="clearSearch"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  поиск: «{search}» ✕
                </button>
              )}
            </span>

            <select
              className="select"
              id="sortSel"
              aria-label="Сортировка"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
            >
              <option value="def">По умолчанию</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="rich">Сначала дороже</option>
              <option value="disc">По размеру скидки</option>
              <option value="abc">По алфавиту</option>
              <option value="rate">По рейтингу</option>
            </select>
          </div>

          <div className="pgrid" id="catGrid">
            {filtered.length > 0 ? (
              filtered.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty" style={{ gridColumn: "1/-1" }}>
                <span className="stamp stamp--red">Не найдено</span>
                <p>Попробуйте иначе, закон это разрешает.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

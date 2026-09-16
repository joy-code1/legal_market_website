"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "../ProductCard";

export const FavsTab: React.FC = () => {
  const { favs, addAllFavsToCart, switchTab } = useMarketplace();

  const favProducts = PRODUCTS.filter((p) => favs.includes(p.id));

  return (
    <section className="panel active" id="tab-favs">
      <div className="sec-head" style={{ marginTop: "6px" }}>
        <h2 className="sec-title">
          Ваше <em>избранное</em>
        </h2>
        {favProducts.length > 0 && (
          <button
            className="btn btn--dim btn--sm"
            id="favAddAll"
            onClick={addAllFavsToCart}
            type="button"
          >
            Всё в корзину
          </button>
        )}
      </div>

      <div id="favsBox">
        {favProducts.length > 0 ? (
          <div className="pgrid">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <span className="stamp stamp--red">Пусто</span>
            <p>Нажмите на сердечко у товара, он появится здесь.</p>
            <button
              className="btn"
              onClick={() => switchTab("catalog")}
              type="button"
            >
              В каталог
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

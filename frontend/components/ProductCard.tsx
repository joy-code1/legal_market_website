"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Icon } from "./icons/Icon";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { favs, toggleFav, addToCart, openProduct, fmt } = useMarketplace();
  const [isAdded, setIsAdded] = useState(false);

  const isFav = favs.includes(product.id);
  const discount = product.old
    ? Math.round((1 - product.price / product.old) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // If click was on favorite heart or add button, don't trigger openProduct
    const target = e.target as HTMLElement;
    if (target.closest(".heart") || target.closest(".p-add")) {
      return;
    }
    openProduct(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 900);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav(product.id);
  };

  return (
    <article
      className="pcard"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="pcard-img">
        <img
          src={`https://picsum.photos/seed/${product.seed}/500/500`}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="p-disc">−{discount}%</span>}
        {!!product.isNew && <span className="p-new">НОВОЕ</span>}
        <button
          className={`heart ${isFav ? "on" : ""}`}
          onClick={handleToggleFav}
          aria-label="В избранное"
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21s-7.5-4.7-9.4-9.3C1.2 8 3.2 4.5 6.6 4.5c2 0 3.8 1.2 5.4 3 1.6-1.8 3.4-3 5.4-3 3.4 0 5.4 3.5 4 7.2C19.5 16.3 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="pcard-body">
        <div className="p-prices">
          <span className="p-price">{fmt(product.price)}</span>
          {product.old && <span className="p-old">{fmt(product.old)}</span>}
        </div>
        <h3 className="p-name">{product.name}</h3>
        <div className="p-rate">
          <span className="star">
            <Icon name="star" size={13} />
          </span>
          <b>{product.rating.toFixed(1)}</b> · {product.rv} оценок
        </div>
        <button
          className={`btn btn--sm btn--w p-add ${isAdded ? "added" : ""}`}
          onClick={handleAddToCart}
          type="button"
        >
          {isAdded ? "✓ Добавлено" : "В корзину"}
        </button>
      </div>
    </article>
  );
};

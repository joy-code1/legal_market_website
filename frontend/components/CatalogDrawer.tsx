"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { PRODUCTS } from "@/data/products";
import { CAT_ICON, SUBCATS } from "@/data/constants";
import { Icon } from "./icons/Icon";

interface CatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CatalogDrawer: React.FC<CatalogDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { switchTab, setCategory } = useMarketplace();
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.cat)));
  const [selectedPanelCat, setSelectedPanelCat] = useState<string>(
    categories[0] || "Дом",
  );

  if (!isOpen) return null;

  const countByCat = (cat: string) =>
    PRODUCTS.filter((p) => p.cat === cat).length;
  const currentSubs = SUBCATS[selectedPanelCat] || [];
  const countCurrent = countByCat(selectedPanelCat);

  return (
    <div className={`cat-panel ${isOpen ? "open" : ""}`} id="catPanel">
      <div className="wrap cp-in">
        <div className="cp-left">
          <button
            className="cp-item"
            onClick={() => {
              setCategory("Все");
              switchTab("catalog");
              onClose();
            }}
          >
            <Icon name="bag" size={19} />
            <span>Все товары</span>
            <span className="cnt">{PRODUCTS.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`cp-item ${selectedPanelCat === c ? "active" : ""}`}
              onClick={() => setSelectedPanelCat(c)}
            >
              <Icon name={CAT_ICON[c] || "box"} size={19} />
              <span>{c}</span>
              <span className="cnt">{countByCat(c)}</span>
            </button>
          ))}
        </div>
        <div className="cp-right swap">
          <div className="cp-right-head">
            <h4>{selectedPanelCat}</h4>
            <button
              className="cp-all"
              onClick={() => {
                setCategory(selectedPanelCat);
                switchTab("catalog");
                onClose();
              }}
            >
              Смотреть все товары <Icon name="right" size={16} />
            </button>
          </div>
          <p>{countCurrent} товаров • все прошли юридическую проверку</p>
          <div className="cp-sub">
            {currentSubs.map((s) => (
              <button
                key={s}
                className="cp-sub-item"
                onClick={() => {
                  setCategory(selectedPanelCat);
                  switchTab("catalog");
                  onClose();
                }}
              >
                {s}
                <span>
                  <Icon name="right" size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { DeliveryContent } from "./tabs/DeliveryTab";
import { FaqContent } from "./tabs/FaqTab";

export const MobileSubpage: React.FC = () => {
  const { subpageOpen, closeSubpage } = useMarketplace();

  if (!subpageOpen) return null;

  const title =
    subpageOpen === "delivery" ? "Доставка и таможня" : "Вопросы и ответы";

  return (
    <div className={`subpage open`} id="subpage">
      <div className="sp-head">
        <button
          className="sp-back"
          id="spBack"
          aria-label="Назад"
          onClick={closeSubpage}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <b className="sp-title">{title}</b>
      </div>
      <div className="sp-body" id="spBody">
        {subpageOpen === "delivery" ? <DeliveryContent /> : <FaqContent />}
      </div>
    </div>
  );
};

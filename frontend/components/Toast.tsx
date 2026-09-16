"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";

export const Toast: React.FC = () => {
  const { toastMessage } = useMarketplace();

  if (!toastMessage) return null;

  return (
    <div className="toast show" role="alert" aria-live="polite">
      {toastMessage}
    </div>
  );
};

"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { COUNTRIES } from "@/data/countries";

interface GeoDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoDropdown: React.FC<GeoDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, setSelectedCountry } = useMarketplace();

  if (!isOpen) return null;

  return (
    <div className="geo-drop">
      {Object.entries(COUNTRIES).map(([code, country]) => {
        const isActive = (profile.country || "RU") === code;
        return (
          <button
            key={code}
            className={`geo-item ${isActive ? "active" : ""}`}
            onClick={() => {
              setSelectedCountry(code);
              onClose();
            }}
          >
            {country.code} • {country.name}
          </button>
        );
      })}
    </div>
  );
};

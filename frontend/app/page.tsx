"use client";

import React from "react";
import {
  MarketplaceProvider,
  useMarketplace,
} from "@/context/MarketplaceContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { AuthModal } from "@/components/AuthModal";
import { MobileSubpage } from "@/components/MobileSubpage";

import { HomeTab } from "@/components/tabs/HomeTab";
import { CatalogTab } from "@/components/tabs/CatalogTab";
import { FavsTab } from "@/components/tabs/FavsTab";
import { ProductDetailTab } from "@/components/tabs/ProductDetailTab";
import { CartTab } from "@/components/tabs/CartTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";
import { DeliveryTab } from "@/components/tabs/DeliveryTab";
import { FaqTab } from "@/components/tabs/FaqTab";

const MarketplaceApp: React.FC = () => {
  const { tab } = useMarketplace();

  return (
    <>
      <Header />
      <main className="wrap">
        {tab === "home" && <HomeTab />}
        {tab === "catalog" && <CatalogTab />}
        {tab === "favs" && <FavsTab />}
        {tab === "product" && <ProductDetailTab />}
        {tab === "cart" && <CartTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "delivery" && <DeliveryTab />}
        {tab === "faq" && <FaqTab />}
      </main>
      <Footer />
      <BottomNav />
      <MobileSubpage />
      <AuthModal />
      <Toast />
    </>
  );
};

export default function Page() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}

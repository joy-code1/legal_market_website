import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ЛЕГАЛЬНО.МАРКЕТ — маркетплейс легальных товаров",
  description:
    "Продаём всё, что можно. Ничего, что нельзя. Это вся наша стратегия.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: "#F5F4EE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

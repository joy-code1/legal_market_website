"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Product,
  Country,
  Order,
  UserProfile,
  Review,
  NotificationItem,
  ChatItem,
  LocalUser,
  TabType,
  CurrencyType,
  SortType,
} from "@/types";
import { PRODUCTS } from "@/data/products";
import { COUNTRIES } from "@/data/countries";
import { RATES, SIGNS } from "@/data/constants";

interface CartLineItem {
  product: Product;
  qty: number;
}

interface MarketplaceContextType {
  tab: TabType;
  switchTab: (t: TabType, restore?: boolean) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  fmt: (amount: number) => string;
  cart: Record<number, number>;
  cartItems: CartLineItem[];
  subtotal: number;
  addToCart: (id: number, qty?: number) => void;
  updateCartQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  favs: number[];
  toggleFav: (id: number) => void;
  addAllFavsToCart: () => void;
  user: string | null;
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  notifs: NotificationItem[];
  markNotifRead: (id: number) => void;
  clearNotifs: () => void;
  chats: ChatItem[];
  lang: string;
  setLang: (lang: string) => void;
  search: string;
  setSearch: (q: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  sort: SortType;
  setSort: (s: SortType) => void;
  currentProduct: Product | null;
  openProduct: (id: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAuthOpen: boolean;
  authMode: "login" | "reg";
  authMessage: string;
  setAuthMode: (mode: "login" | "reg") => void;
  openAuth: (mode?: "login" | "reg", msg?: string) => void;
  closeAuth: () => void;
  loginUser: (email: string, pass: string) => boolean;
  registerUser: (
    name: string,
    email: string,
    pass: string,
  ) => { success: boolean; msg?: string };
  logoutUser: () => void;
  subpageOpen: "delivery" | "faq" | null;
  openSubpage: (page: "delivery" | "faq") => void;
  closeSubpage: () => void;
  isCatPanelOpen: boolean;
  setCatPanelOpen: (open: boolean) => void;
  selectedCountry: Country;
  setSelectedCountry: (code: string) => void;
  lastOrder: Order | null;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
  undefined,
);

const safeLocalStorage = {
  get: <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: <T,>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tab, setTab] = useState<TabType>("home");
  const [currency, setCurrencyState] = useState<CurrencyType>(() =>
    safeLocalStorage.get<CurrencyType>("lm5_cur", "RUB"),
  );
  const [cart, setCart] = useState<Record<number, number>>(() =>
    safeLocalStorage.get<Record<number, number>>("lm5_cart", {}),
  );
  const [favs, setFavs] = useState<number[]>(() =>
    safeLocalStorage.get<number[]>("lm5_favs", []),
  );
  const [user, setUser] = useState<string | null>(() =>
    safeLocalStorage.get<string | null>("lm5_user", null),
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    safeLocalStorage.get<UserProfile>("lm5_profile", {
      name: "",
      email: "",
      country: "RU",
      cardNo: "LM-24-428901",
      pts: 0,
    }),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeLocalStorage.get<Order[]>("lm5_orders", []),
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    safeLocalStorage.get<Review[]>("lm5_reviews", []),
  );
  const [notifs, setNotifs] = useState<NotificationItem[]>(() =>
    safeLocalStorage.get<NotificationItem[]>("lm5_notifs", [
      {
        id: 1,
        text: "Добро пожаловать в ЛЕГАЛЬНО.МАРКЕТ! Всё легально, всё для вас.",
        date: new Date().toLocaleDateString("ru-RU"),
        read: false,
      },
    ]),
  );
  const [chats] = useState<ChatItem[]>(() =>
    safeLocalStorage.get<ChatItem[]>("lm5_chats", [
      {
        name: "Поддержка ЛЕГАЛЬНО.МАРКЕТ",
        last: "Здравствуйте! Чем можем помочь?",
        online: true,
      },
    ]),
  );
  const [lang, setLangState] = useState<string>(() =>
    safeLocalStorage.get<string>("lm5_lang", "ru"),
  );
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("Все");
  const [sort, setSort] = useState<SortType>("def");
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "reg">("login");
  const [authMessage, setAuthMessage] = useState("");
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [subpageOpen, setSubpageOpen] = useState<"delivery" | "faq" | null>(
    null,
  );
  const [isCatPanelOpen, setCatPanelOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [scrollRestoreY, setScrollRestoreY] = useState<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const setCurrency = useCallback((c: CurrencyType) => {
    setCurrencyState(c);
    safeLocalStorage.set("lm5_cur", c);
  }, []);

  const setLang = useCallback((l: string) => {
    setLangState(l);
    safeLocalStorage.set("lm5_lang", l);
  }, []);

  const fmt = useCallback(
    (amount: number): string => {
      const rate = RATES[currency] || 1;
      const sign = SIGNS[currency] || "₽";
      return Math.round(amount * rate).toLocaleString("ru-RU") + " " + sign;
    },
    [currency],
  );

  const switchTab = useCallback(
    (newTab: TabType, restore?: boolean) => {
      setCatPanelOpen(false);
      setTab(newTab);
      if (restore && scrollRestoreY != null) {
        setTimeout(() => window.scrollTo(0, scrollRestoreY), 60);
        setScrollRestoreY(null);
      } else {
        window.scrollTo(0, 0);
      }
    },
    [scrollRestoreY],
  );

  const openProduct = useCallback(
    (id: number) => {
      const found = PRODUCTS.find((p) => p.id === id);
      if (!found) {
        showToast("Товар не найден");
        return;
      }
      setScrollRestoreY(window.scrollY);
      setCurrentProductId(id);
      switchTab("product");
    },
    [showToast, switchTab],
  );

  const addToCart = useCallback(
    (id: number, qty = 1) => {
      setCart((prev) => {
        const next = { ...prev, [id]: (prev[id] || 0) + qty };
        safeLocalStorage.set("lm5_cart", next);
        return next;
      });
      showToast("✓ Товар в корзине");
    },
    [showToast],
  );

  const updateCartQty = useCallback((id: number, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) {
        delete next[id];
      } else {
        next[id] = newQty;
      }
      safeLocalStorage.set("lm5_cart", next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback(
    (id: number) => {
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        safeLocalStorage.set("lm5_cart", next);
        return next;
      });
      showToast("Позиция удалена из корзины");
    },
    [showToast],
  );

  const clearCart = useCallback(() => {
    setCart({});
    safeLocalStorage.set("lm5_cart", {});
  }, []);

  const toggleFav = useCallback(
    (id: number) => {
      setFavs((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
        safeLocalStorage.set("lm5_favs", next);
        showToast(exists ? "Убрано из избранного" : "Добавлено в избранное");
        return next;
      });
    },
    [showToast],
  );

  const addAllFavsToCart = useCallback(() => {
    setCart((prev) => {
      const next = { ...prev };
      favs.forEach((id) => {
        next[id] = (next[id] || 0) + 1;
      });
      safeLocalStorage.set("lm5_cart", next);
      return next;
    });
    showToast("Всё избранное — в корзине");
  }, [favs, showToast]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...data };
      safeLocalStorage.set("lm5_profile", next);
      return next;
    });
  }, []);

  const setSelectedCountry = useCallback(
    (code: string) => {
      if (COUNTRIES[code]) {
        updateProfile({ country: code });
        showToast("✓ Страна доставки: " + COUNTRIES[code].name);
      }
    },
    [updateProfile, showToast],
  );

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => {
        const next = [order, ...prev];
        safeLocalStorage.set("lm5_orders", next);
        return next;
      });
      setLastOrder(order);
      setNotifs((prev) => {
        const next = [
          {
            id: Date.now(),
            text: `Заказ ${order.num} оформлен и передан юристам на проверку.`,
            date: order.date,
            read: false,
          },
          ...prev,
        ];
        safeLocalStorage.set("lm5_notifs", next);
        return next;
      });
      updateProfile({
        pts: profile.pts + order.pts,
      });
      clearCart();
    },
    [profile.pts, updateProfile, clearCart],
  );

  const addReview = useCallback(
    (review: Review) => {
      setReviews((prev) => {
        const next = [review, ...prev];
        safeLocalStorage.set("lm5_reviews", next);
        return next;
      });
      updateProfile({ pts: profile.pts + 5 });
      showToast("Спасибо за отзыв! +5 очков");
    },
    [profile.pts, updateProfile, showToast],
  );

  const markNotifRead = useCallback((id: number) => {
    setNotifs((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      safeLocalStorage.set("lm5_notifs", next);
      return next;
    });
  }, []);

  const clearNotifs = useCallback(() => {
    setNotifs([]);
    safeLocalStorage.set("lm5_notifs", []);
  }, []);

  const openAuth = useCallback((mode: "login" | "reg" = "login", msg = "") => {
    setAuthMode(mode);
    setAuthMessage(msg);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsAuthOpen(false);
    setAuthMessage("");
    setPendingCheckout(false);
  }, []);

  const loginUser = useCallback(
    (email: string, pass: string): boolean => {
      const users = safeLocalStorage.get<LocalUser[]>("lm5_users", []);
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!matched || matched.pass !== pass) {
        setAuthMessage("Неверный email или пароль");
        return false;
      }
      setUser(matched.email);
      updateProfile({
        name: matched.name,
        email: matched.email,
      });
      safeLocalStorage.set("lm5_user", matched.email);
      closeAuth();
      showToast(`✓ Добро пожаловать, ${matched.name.split(" ")[0]}!`);
      if (pendingCheckout) {
        switchTab("cart");
      }
      return true;
    },
    [closeAuth, showToast, pendingCheckout, switchTab, updateProfile],
  );

  const registerUser = useCallback(
    (
      name: string,
      email: string,
      pass: string,
    ): { success: boolean; msg?: string } => {
      const users = safeLocalStorage.get<LocalUser[]>("lm5_users", []);
      if (
        users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      ) {
        return { success: false, msg: "Этот email уже зарегистрирован" };
      }
      const newUser: LocalUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        pass,
      };
      users.push(newUser);
      safeLocalStorage.set("lm5_users", users);

      setUser(newUser.email);
      updateProfile({
        name: newUser.name,
        email: newUser.email,
      });
      safeLocalStorage.set("lm5_user", newUser.email);
      closeAuth();
      showToast("✓ Аккаунт создан. Добро пожаловать!");
      if (pendingCheckout) {
        switchTab("cart");
      }
      return { success: true };
    },
    [closeAuth, showToast, pendingCheckout, switchTab, updateProfile],
  );

  const logoutUser = useCallback(() => {
    setUser(null);
    safeLocalStorage.set("lm5_user", null);
    showToast("Вы вышли из аккаунта");
  }, [showToast]);

  const openSubpage = useCallback((p: "delivery" | "faq") => {
    setSubpageOpen(p);
  }, []);

  const closeSubpage = useCallback(() => {
    setSubpageOpen(null);
  }, []);

  const cartItems: CartLineItem[] = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = PRODUCTS.find((p) => p.id === Number(id));
      return prod ? { product: prod, qty } : null;
    })
    .filter((item): item is CartLineItem => item !== null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );
  const currentProduct =
    PRODUCTS.find((p) => p.id === currentProductId) || null;
  const selectedCountry = COUNTRIES[profile.country || "RU"] || COUNTRIES.RU;

  return (
    <MarketplaceContext.Provider
      value={{
        tab,
        switchTab,
        currency,
        setCurrency,
        fmt,
        cart,
        cartItems,
        subtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        favs,
        toggleFav,
        addAllFavsToCart,
        user,
        profile,
        updateProfile,
        orders,
        addOrder,
        reviews,
        addReview,
        notifs,
        markNotifRead,
        clearNotifs,
        chats,
        lang,
        setLang,
        search,
        setSearch,
        category,
        setCategory,
        sort,
        setSort,
        currentProduct,
        openProduct,
        toastMessage,
        showToast,
        isAuthOpen,
        authMode,
        authMessage,
        setAuthMode,
        openAuth,
        closeAuth,
        loginUser,
        registerUser,
        logoutUser,
        subpageOpen,
        openSubpage,
        closeSubpage,
        isCatPanelOpen,
        setCatPanelOpen,
        selectedCountry,
        setSelectedCountry,
        lastOrder,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

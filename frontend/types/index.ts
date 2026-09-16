export interface Product {
  id: number;
  slug: string;
  name: string;
  cat: string;
  price: number;
  old: number | null;
  rating: number;
  rv: number;
  sku: string;
  origin: string;
  seed: string;
  desc: string;
  stock: number;
  isNew?: number;
}

export interface Country {
  code: string;
  name: string;
  days: string;
  ship: number;
  note: string;
}

export interface OrderLine {
  id: number;
  name: string;
}

export interface Order {
  num: string;
  date: string;
  items: number;
  lines: OrderLine[];
  total: number;
  pts: number;
  country: string;
  days: string;
  pay: string;
}

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  cardNo: string;
  pts: number;
}

export interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface NotificationItem {
  id: number;
  text: string;
  date: string;
  read: boolean;
}

export interface ChatItem {
  name: string;
  last: string;
  online: boolean;
}

export interface LocalUser {
  name: string;
  email: string;
  pass: string;
}

export type TabType =
  | 'home'
  | 'catalog'
  | 'favs'
  | 'product'
  | 'cart'
  | 'profile'
  | 'delivery'
  | 'faq';

export type CurrencyType = 'RUB' | 'USD' | 'EUR';

export type SortType = 'def' | 'cheap' | 'rich' | 'disc' | 'abc' | 'rate';


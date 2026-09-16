import { CurrencyType } from '@/types';

export const CAT_ICON: Record<string, string> = {
  Дом: 'home',
  Техника: 'tech',
  Еда: 'food',
  Транспорт: 'transport',
  Хобби: 'hobby',
  Живность: 'plant',
  Странное: 'box',
};

export const SUBCATS: Record<string, string[]> = {
  Дом: ['Лопаты и садовый инвентарь', 'Текстиль и одежда', 'Декор и уют'],
  Техника: ['Кофемашины', 'Печатные машинки', 'Аксессуары'],
  Еда: ['Сыры', 'Фермерское', 'Напитки'],
  Транспорт: ['Водный транспорт', 'Велосипеды', 'Палатки и туризм'],
  Хобби: ['Музыкальные инструменты', 'Настольные игры', 'Глобусы и карты'],
  Живность: ['Растения', 'Аквариумы', 'Аксессуары'],
  Странное: ['Кирпичи', 'Воздух в банках', 'Коллекционное'],
};

export const PM_ITEMS = [
  { key: 'orders', label: 'Мои заказы', icon: 'box' },
  { key: 'reviews', label: 'Мои отзывы', icon: 'star' },
  { key: 'seller', label: 'Стать продавцом', icon: 'tag' },
  { key: 'chats', label: 'Мои чаты', icon: 'chat' },
  { key: 'notif', label: 'Уведомления', icon: 'bell' },
  { key: 'settings', label: 'Настройки', icon: 'gear' },
  { key: 'lang', label: 'Язык приложения', icon: 'globe' },
  { key: 'help', label: 'Справка', icon: 'help' },
  { key: 'social', label: 'Мы в соцсетях', icon: 'share' },
  { key: 'contact', label: 'Связаться с нами', icon: 'phone' },
];

export const RATES: Record<CurrencyType, number> = {
  RUB: 1,
  USD: 0.011,
  EUR: 0.01,
};

export const SIGNS: Record<CurrencyType, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
};


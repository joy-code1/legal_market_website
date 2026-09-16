import { Country } from '@/types';

export const COUNTRIES: Record<string, Country> = {
  RU: {
    code: 'RU',
    name: 'Россия',
    days: '1-3',
    ship: 390,
    note: 'По РФ бесплатно от 5 000 ₽',
  },
  BY: {
    code: 'BY',
    name: 'Беларусь',
    days: '3-6',
    ship: 700,
    note: 'Без таможенного оформления',
  },
  KZ: {
    code: 'KZ',
    name: 'Казахстан',
    days: '4-8',
    ship: 900,
    note: 'ЕАЭС, без пошлин',
  },
  RS: {
    code: 'RS',
    name: 'Сербия',
    days: '7-14',
    ship: 1900,
    note: 'Документы оформляем сами',
  },
  TR: {
    code: 'TR',
    name: 'Турция',
    days: '6-12',
    ship: 2200,
    note: 'До 30 € без декларации',
  },
  AE: {
    code: 'AE',
    name: 'ОАЭ',
    days: '7-12',
    ship: 2600,
    note: 'Таможня включена',
  },
  DE: {
    code: 'DE',
    name: 'Германия',
    days: '8-15',
    ship: 2900,
    note: 'Оформление импорта в ЕС, на нас',
  },
  VN: {
    code: 'VN',
    name: 'Вьетнам',
    days: '10-18',
    ship: 3100,
    note: 'Проверено, всё доезжает целым',
  },
  BR: {
    code: 'BR',
    name: 'Бразилия',
    days: '15-30',
    ship: 4500,
    note: 'Долго, но легально',
  },
  IS: {
    code: 'IS',
    name: 'Исландия',
    days: '9-16',
    ship: 3400,
    note: 'Да, до Рейкьявика тоже можно',
  },
};


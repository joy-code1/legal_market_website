# Backend — ЛЕГАЛЬНО.МАРКЕТ API

Backend-сервис маркетплейса «ЛЕГАЛЬНО.МАРКЕТ» на базе **Python 3.12+**, **Django 6.1** и **Django REST Framework (DRF)**.

---

## 🚀 Быстрый старт локально

### 1. Активация виртуального окружения

```bash
cd backend
source venv/bin/activate
```

### 2. Установка зависимостей

```bash
pip install djangorestframework djangorestframework-simplejwt django-cors-headers drf-spectacular pillow
```

### 3. Применение миграций и запуск

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

API будет доступно по адресу: `http://localhost:8000/api/v1/`  
Панель администратора: `http://localhost:8000/admin/`

---

## 📋 Задачи для Backend Developer (Roadmap)

Ниже представлен подробный список задач, сгруппированных по этапам реализации.

### Блок BE-1: Настройка инфраструктуры и базовой конфигурации

- [ ] **BE-1.1 Зависимости и settings**:
  - Подключить `rest_framework`, `corsheaders`, `drf_spectacular` в `INSTALLED_APPS`.
  - Настроить `CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]`.
  - Настроить работу с медиа-файлами (`MEDIA_URL`, `MEDIA_ROOT`).
  - Вынести секретные ключи, `DEBUG` и `ALLOWED_HOSTS` в `.env` файл (`python-dotenv` или `django-environ`).
- [ ] **BE-1.2 Структура приложений**:
  - Создать каталог `apps/` и зарегистрировать приложения: `apps.users`, `apps.catalog`, `apps.orders`, `apps.interactions`.

---

### Блок BE-2: Приложение `apps.users` (Пользователи и профили)

- [ ] **BE-2.1 Кастомная модель пользователя**:
  - Наследовать `AbstractUser`, использовать `email` как основной идентификатор для входа (`USERNAME_FIELD = 'email'`).
  - Поля: `name` (полное имя), `card_number` (формат `LM-24-XXXXXX`, автогенерация при создании), `legality_points` (баллы легальности, по умолчанию 0), `default_country` (код страны, по умолчанию `'RU'`), `is_seller` (boolean).
- [ ] **BE-2.2 JWT Авторизация**:
  - Настроить `rest_framework_simplejwt`: генерация Access и Refresh токенов.
  - Эндпоинт регистрации: `POST /api/v1/auth/register/` (валидация email, пароль от 6 символов, авто-создание карты и начисление приветственных баллов).
  - Эндпоинт логина: `POST /api/v1/auth/login/` (выдача пары токенов).
  - Эндпоинт профиля: `GET /api/v1/auth/profile/` и `PATCH /api/v1/auth/profile/` (просмотр и редактирование имени, email, страны по умолчанию).

---

### Блок BE-3: Приложение `apps.catalog` (Каталог товаров)

- [ ] **BE-3.1 Модели категорий и товаров**:
  - `Category`: `name` (Дом, Техника, Еда, Транспорт, Хобби, Живность, Странное), `slug`, `icon`.
  - `Subcategory`: `category` (FK), `name`, `slug`.
  - `Product`:
    - `name`, `slug`, `sku` (например, `LM-0042`), `category` (FK), `subcategory` (FK, null=True).
    - `price` (Decimal), `old_price` (Decimal, null=True), `stock` (Integer).
    - `origin` (страна происхождения), `description` (Text).
    - `is_new` (Boolean, новинка ли).
    - `protocol_number` (номер юридического протокола, например `LM-0042-П`).
    - `rating` (Float, default 5.0), `rv_count` (Integer, default 0).
  - `ProductImage`: `product` (FK), `image`, `order`, `is_main`.
- [ ] **BE-3.2 Эндпоинты каталога**:
  - `GET /api/v1/categories/` — список категорий с подкатегориями и счетчиками товаров (`product_count`).
  - `GET /api/v1/products/` — список товаров с поддержкой:
    - Фильтрации по категории (`?cat=Дом`).
    - Поиска (`?search=лопата` — по названию, артикулу, категории, описанию).
    - Сортировки (`?sort=cheap` — дешевле, `rich` — дороже, `disc` — скидки, `abc` — алфавит, `rate` — рейтинг).
    - Пагинации (`PageNumberPagination`).
  - `GET /api/v1/products/{id}/` — детальная информация о товаре, включая характеристики, галерею фото, отзывы.
  - `GET /api/v1/products/{id}/similar/` — похожие товары (из той же категории).

---

### Блок BE-4: Приложение `apps.orders` (Корзина, доставка, чекаут)

- [ ] **BE-4.1 Модели доставки и заказов**:
  - `CountryShippingRate`: `code` (RU, BY, KZ, DE...), `name`, `days_min`, `days_max`, `cost` (Decimal), `free_threshold` (Decimal, например 5000 для РФ), `customs_note`.
  - `Cart` и `CartItem`:
    - Привязка к `user` (или сессии/анонимному токену для гостей).
    - `product` (FK), `quantity` (Integer > 0).
  - `Order`:
    - `order_number`: уникальный номер (например, `LM-4821-Б`).
    - `user` (FK, `on_delete=PROTECT`).
    - `recipient_name`, `recipient_email`, `country_code`, `city`, `address`.
    - `shipping_method`: `'std'` (стандарт) или `'exp'` (экспресс, коэф. ×1.9).
    - `shipping_cost`, `subtotal`, `total_amount`.
    - `pts_earned`: начисленные баллы (`round(total_amount / 10)`).
    - `payment_method`: `'Карта'`, `'СБП'`, `'Крипта'`.
    - `status`: `'created'`, `'legal_review'`, `'processing'`, `'shipped'`, `'delivered'`.
  - `OrderItem`:
    - `order` (FK), `product` (FK), `price_snapshot`, `quantity`, `product_name_snapshot`.
  - `LegalityCertificate`:
    - Привязка `OneToOne` к `Order`.
    - `certificate_number` (`№ LM-XXXX-X`).
    - `claims_count = 0` («Претензий: 0»).
    - Метод генерации PDF или подписанного электронного документа.
- [ ] **BE-4.2 Бизнес-логика оформления заказа**:
  - Использовать `transaction.atomic` для создания заказа.
  - Проверка остатков (`product.stock >= quantity`).
  - Уменьшение остатка товара на складе.
  - Начисление баллов пользователю (`user.legality_points += pts_earned`).
  - Автоматическое создание сертификата легальности.
- [ ] **BE-4.3 Эндпоинты**:
  - `GET /api/v1/countries/` — список стран и тарифов.
  - `GET, POST, DELETE /api/v1/cart/` — управление корзиной.
  - `POST /api/v1/orders/` — оформление заказа.
  - `GET /api/v1/orders/` — история заказов авторизованного пользователя.
  - `GET /api/v1/orders/{id}/` — детали заказа и сертификат легальности.

---

### Блок BE-5: Приложение `apps.interactions` (Отзывы, уведомления, заявки)

- [ ] **BE-5.1 Отзывы (`Review`)**:
  - Поля: `product` (FK), `user` (FK), `rating` (1-5), `text`, `status` (`approved` / `pending`).
  - Эндпоинт `GET /api/v1/products/{id}/reviews/` — отзывы о товаре.
  - Эндпоинт `POST /api/v1/reviews/` — создание отзыва к ранее купленному товару (начисление +5 баллов).
- [ ] **BE-5.2 Уведомления (`Notification`)**:
  - Поля: `user` (FK), `text`, `is_read`, `created_at`.
  - Эндпоинты `GET /api/v1/notifications/`, `PATCH /api/v1/notifications/{id}/read/`, `DELETE /api/v1/notifications/clear/`.
- [ ] **BE-5.3 Заявка продавца (`SellerApplication`)**:
  - Поля: `user` (FK), `store_name`, `status` (`submitted`, `approved`, `rejected`), `created_at`.
  - Эндпоинт `POST /api/v1/seller-applications/`.

---

### Блок BE-6: Сидинг данных (Data Seed)

- [ ] Создать команду `python manage.py seed_data`:
  - Загрузка всех 10 стран и их тарифов доставки.
  - Загрузка 7 основных категорий и подкатегорий.
  - Загрузка 15 исходных товаров с ценами, скидками, артикулами и описаниями (из `frontend/data/products.ts`).

---

### Блок BE-7: Документация API (Swagger / OpenAPI)

- [ ] Настроить `drf-spectacular`:
  - Генерация схемы: `/api/v1/schema/`
  - Интерактивный UI Swagger: `/api/v1/docs/`
  - Redoc UI: `/api/v1/redoc/`

---

### Блок BE-8: Тестирование

- [ ] Настроить `pytest` и `pytest-django`.
- [ ] Написать тесты для:
  - Авторизации (регистрация, логин, выдача номера карты).
  - Каталога (фильтрация по категории, поиск, сортировка).
  - Чекаута (расчет доставки, валидация полей, списание остатков, начисление очков).
  - Прав доступа (изоляция заказов одного пользователя от другого).

---

## 📡 Спецификация REST API

| Метод    | URL                              | Описание                                     | Доступ         |
| -------- | -------------------------------- | -------------------------------------------- | -------------- |
| `POST`   | `/api/v1/auth/register/`         | Регистрация (выпуск карты покупателя)        | Public         |
| `POST`   | `/api/v1/auth/login/`            | Вход (получение access + refresh JWT)        | Public         |
| `POST`   | `/api/v1/auth/refresh/`          | Обновление токена                            | Public         |
| `GET`    | `/api/v1/auth/profile/`          | Данные профиля, очков и карты                | Authenticated  |
| `PATCH`  | `/api/v1/auth/profile/`          | Редактирование профиля (имя, страна)         | Authenticated  |
| `GET`    | `/api/v1/categories/`            | Список категорий и подкатегорий              | Public         |
| `GET`    | `/api/v1/products/`              | Каталог товаров (поиск, фильтры, сортировка) | Public         |
| `GET`    | `/api/v1/products/{id}/`         | Карточка товара                              | Public         |
| `GET`    | `/api/v1/products/{id}/similar/` | Похожие товары                               | Public         |
| `GET`    | `/api/v1/countries/`             | Страны доставки и тарифы                     | Public         |
| `GET`    | `/api/v1/cart/`                  | Получить корзину                             | Session / User |
| `POST`   | `/api/v1/cart/items/`            | Добавить товар в корзину                     | Session / User |
| `PATCH`  | `/api/v1/cart/items/{id}/`       | Изменить количество                          | Session / User |
| `DELETE` | `/api/v1/cart/items/{id}/`       | Удалить позицию                              | Session / User |
| `POST`   | `/api/v1/orders/`                | Оформить заказ (выпуск сертификата)          | Authenticated  |
| `GET`    | `/api/v1/orders/`                | История заказов покупателя                   | Authenticated  |
| `GET`    | `/api/v1/orders/{id}/`           | Детали заказа и сертификат легальности       | Authenticated  |
| `GET`    | `/api/v1/products/{id}/reviews/` | Отзывы о товаре                              | Public         |
| `POST`   | `/api/v1/reviews/`               | Оставить отзыв о купленном товаре            | Authenticated  |
| `GET`    | `/api/v1/notifications/`         | Список уведомлений                           | Authenticated  |
| `POST`   | `/api/v1/seller-applications/`   | Заявка «Стать продавцом»                     | Authenticated  |

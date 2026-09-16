"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { COUNTRIES } from "@/data/countries";
import { Icon } from "../icons/Icon";

export const DeliveryContent: React.FC = () => {
  const { fmt } = useMarketplace();

  return (
    <>
      <div className="info-cards">
        <div className="info-card">
          <h3>
            <Icon name="box" size={20} />
            Как проходит таможня
          </h3>
          <p>
            К каждой международной посылке прикладываем сертификат легальности и
            полный пакет документов. Вопросы таможни наш юрист закрывает сам.
          </p>
        </div>
        <div className="info-card">
          <h3>
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
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
            По России, бесплатно
          </h3>
          <p>
            Заказы от 5 000 ₽ по РФ доставляем за свой счёт. СДЭК, Почта или
            курьер, на выбор при оформлении.
          </p>
        </div>
        <div className="info-card">
          <h3>
            <Icon name="globe" size={20} />
            Трекинг каждой посылки
          </h3>
          <p>
            Номер отслеживания приходит на email сразу после передачи в службу
            доставки. Даже кирпич едет по треку.
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="dtable">
          <thead>
            <tr>
              <th>Страна</th>
              <th>Срок</th>
              <th>Стоимость</th>
              <th>Примечание</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(COUNTRIES).map((c) => (
              <tr key={c.code}>
                <td>
                  <span className="cn-code">{c.code}</span> <b>{c.name}</b>
                </td>
                <td className="mono">{c.days} дн.</td>
                <td className="mono">{fmt(c.ship)}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const DeliveryTab: React.FC = () => {
  const { switchTab } = useMarketplace();

  return (
    <section className="panel active" id="tab-delivery">
      <div className="crumbs">
        <button onClick={() => switchTab("home")} type="button">
          Главная
        </button>
        <span className="sep">/</span>
        <span className="cur">Доставка</span>
      </div>
      <div className="sec-head">
        <h2 className="sec-title">
          Доставка <em>и таможня</em>
        </h2>
        <span className="sec-note">63 страны • везде легально</span>
      </div>

      <DeliveryContent />
    </section>
  );
};

"use client";

import React from "react";
import { useMarketplace } from "@/context/MarketplaceContext";

export const FaqContent: React.FC = () => {
  return (
    <div id="faqList">
      <details className="faq-item">
        <summary>
          Вы правда продаёте всё?<span className="plus">+</span>
        </summary>
        <p>
          Почти. Всё, что существует физически и разрешено к обороту. Если
          товара нет в каталоге, напишите нам, найдём легальную версию.
        </p>
      </details>
      <details className="faq-item">
        <summary>
          А оружие продаёте?<span className="plus">+</span>
        </summary>
        <p>
          Нет. Это нелегально без лицензии, а лицензии мы не выдаём. Зато
          продаём очень убедительные водяные пистолеты.
        </p>
      </details>
      <details className="faq-item">
        <summary>
          Как оплатить из другой страны?<span className="plus">+</span>
        </summary>
        <p>
          Принимаем международные карты, СБП для России и СНГ, криптовалюту.
          Валюта на сайте переключается в настройках профиля: ₽, $, €.
        </p>
      </details>
      <details className="faq-item">
        <summary>
          Что если таможня задаст вопросы?<span className="plus">+</span>
        </summary>
        <p>
          К каждой посылке прикладывается сертификат легальности и пакет
          документов. Если вопросы всё же возникнут, наш юрист ответит на них за
          вас. Бесплатно.
        </p>
      </details>
      <details className="faq-item">
        <summary>
          Есть ли скидки юристам?<span className="plus">+</span>
        </summary>
        <p>
          Да, 10% при предъявлении печати. Судьям, 15%, но только вне рабочее
          время.
        </p>
      </details>
    </div>
  );
};

export const FaqTab: React.FC = () => {
  const { switchTab } = useMarketplace();

  return (
    <section className="panel active" id="tab-faq">
      <div className="crumbs">
        <button onClick={() => switchTab("home")} type="button">
          Главная
        </button>
        <span className="sep">/</span>
        <span className="cur">Вопросы</span>
      </div>
      <div className="sec-head">
        <h2 className="sec-title">
          Вопросы <em>и ответы</em>
        </h2>
      </div>

      <FaqContent />
    </section>
  );
};

import React from "react";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/home-extras.css";

export const AnnounceBar = () => {
  const { t } = useTranslation("home");
  const items = [
    { icon: "fa-truck", text: t("announce.delivery") },
    { icon: "fa-certificate", text: t("announce.authentic") },
    { icon: "fa-lock", text: t("announce.secure") },
    { icon: "fa-heart", text: t("announce.clients") },
    { icon: "fa-comments", text: t("announce.support") },
  ];
  return (
    <div className="announce-bar">
      <Marquee gradient={false} speed={45} pauseOnHover>
        {items.concat(items).map((it, i) => (
          <span className="announce-item" key={i}>
            <i className={`fa ${it.icon}`} aria-hidden="true"></i>
            {it.text}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

const Benefits = () => {
  const { t } = useTranslation("home");
  const benefits = [
    { icon: "fa-truck", title: t("benefits.delivery_t"), sub: t("benefits.delivery_s") },
    { icon: "fa-shield", title: t("benefits.quality_t"), sub: t("benefits.quality_s") },
    { icon: "fa-lock", title: t("benefits.secure_t"), sub: t("benefits.secure_s") },
    { icon: "fa-life-ring", title: t("benefits.support_t"), sub: t("benefits.support_s") },
  ];
  return (
    <div className="benefits-strip">
      {benefits.map((b) => (
        <div className="benefit-card" key={b.title}>
          <span className="benefit-icon">
            <i className={`fa ${b.icon}`} aria-hidden="true"></i>
          </span>
          <span className="benefit-text">
            <strong>{b.title}</strong>
            <span>{b.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

const categoryIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("coiff") || t.includes("hair")) return "fa-scissors";
  if (t.includes("esth")) return "fa-magic";
  if (t.includes("parfum") || t.includes("parf")) return "fa-tint";
  if (t.includes("maquill") || t.includes("make")) return "fa-paint-brush";
  if (t.includes("access")) return "fa-shopping-bag";
  if (t.includes("appareil") || t.includes("electr")) return "fa-bolt";
  if (t.includes("bonnet") || t.includes("merc")) return "fa-thumb-tack";
  if (t.includes("soin") || t.includes("skin")) return "fa-leaf";
  if (t.includes("ongle") || t.includes("nail")) return "fa-hand-paper-o";
  return "fa-star-o";
};

const CategoryShowcase = ({ categories, onCategory }) => {
  const { t } = useTranslation("home");
  if (!categories || categories.length === 0) return null;
  const tiles = categories.slice(0, 8);
  return (
    <section className="home-section">
      <div className="home-section-head">
        <span className="home-eyebrow">{t("cat_eyebrow")}</span>
        <h2 className="home-title">
          {t("cat_title")} <em>{t("cat_title_em")}</em>
        </h2>
        <span className="home-rule" />
      </div>
      <div className="category-showcase">
        {tiles.map((cat) => (
          <button
            type="button"
            className="category-tile"
            key={cat.title}
            onClick={() => onCategory && onCategory(cat.title)}
          >
            <span className="category-tile-icon">
              <i className={`fa ${categoryIcon(cat.title)}`} aria-hidden="true"></i>
            </span>
            <span className="category-tile-body">
              <span className="category-tile-title">{cat.title}</span>
              {cat?.subcategories?.length > 0 && (
                <span className="category-tile-count">
                  {cat.subcategories.length} {t("cat_sub")}
                </span>
              )}
            </span>
            <span className="category-tile-cta">
              {t("discover")} <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

const PromoBand = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  return (
    <section className="home-section" style={{ paddingTop: 0 }}>
      <div className="promo-band">
        <div className="promo-band-inner">
          <span className="promo-band-eyebrow">{t("promo_eyebrow")}</span>
          <h2 className="promo-band-title">{t("promo_title")}</h2>
          <p style={{ maxWidth: 540, opacity: 0.92, margin: 0 }}>
            {t("promo_text")}
          </p>
          <button className="promo-band-btn" onClick={() => navigate("/brands")}>
            {t("promo_btn")}
          </button>
        </div>
      </div>
    </section>
  );
};

const HomeExtras = ({ categories, onCategory }) => {
  return (
    <>
      <Benefits />
      <CategoryShowcase categories={categories} onCategory={onCategory} />
      <PromoBand />
    </>
  );
};

export default HomeExtras;

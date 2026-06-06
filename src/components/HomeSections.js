import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "../config";
import "../styles/home-sections.css";

/* ---------------- Stats / trust band ---------------- */
const useCountUp = (target, run, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    let start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return value;
};

const Stat = ({ target, suffix, label, run, decimals }) => {
  const value = useCountUp(decimals ? target * 10 : target, run);
  const display = decimals ? (value / 10).toFixed(1) : value;
  return (
    <div className="stat-item">
      <span className="stat-value">
        {display}
        <em>{suffix}</em>
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export const StatsBand = () => {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  const { t } = useTranslation("home");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRun(true)),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="stats-band" ref={ref}>
      <div className="stats-inner">
        <Stat target={20} suffix="+" label={t("stats_brands")} run={run} />
        <Stat target={600} suffix="+" label={t("stats_products")} run={run} />
        <Stat target={10} suffix="K+" label={t("stats_clients")} run={run} />
        <Stat target={4.8} suffix="/5" label={t("stats_rating")} run={run} decimals />
      </div>
    </section>
  );
};

/* ---------------- Editorial brand-story split ---------------- */
export const EditorialStory = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  return (
    <section className="editorial">
      <div className="editorial-media">
        <img src="/cover.jpg" alt="Univers beauté" />
        <span className="editorial-badge">{t("editorial_badge")}</span>
      </div>
      <div className="editorial-content">
        <span className="home-eyebrow">{t("editorial_eyebrow")}</span>
        <h2 className="home-title">
          {t("editorial_title")} <em>{t("editorial_title_em")}</em>
          {t("editorial_title_end")}
        </h2>
        <p>{t("editorial_text")}</p>
        <div className="editorial-actions">
          <button className="btn-brand" onClick={() => navigate("/brands")}>
            {t("editorial_btn1")}
          </button>
          <button className="btn-ghost" onClick={() => navigate("/contact")}>
            {t("editorial_btn2")}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Testimonials ---------------- */
const TESTIMONIALS = [
  {
    text: "Produits 100% authentiques et livraison super rapide. Ma boutique beauté préférée en Tunisie !",
    name: "Amira B.",
    role: "Cliente fidèle",
  },
  {
    text: "Un choix incroyable de marques professionnelles. Les conseils et le service sont au top.",
    name: "Sonia M.",
    role: "Coiffeuse",
  },
  {
    text: "Enfin des produits de salon à la maison. Qualité irréprochable, je recommande les yeux fermés.",
    name: "Yasmine K.",
    role: "Make-up artist",
  },
  {
    text: "Commande reçue en 48h, emballage soigné et produits conformes. Bravo à toute l'équipe.",
    name: "Khaled T.",
    role: "Client",
  },
];

const emptyForm = { name: "", role: "", text: "", rating: 5 };

export const Testimonials = () => {
  const { t } = useTranslation("home");

  const [items, setItems] = useState(null); // null = loading
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API_BASE}/api/testimonials`)
      .then(({ data }) => {
        if (active) setItems(data.testimonials || []);
      })
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error(t("testi_required") !== "testi_required" ? t("testi_required") : "Nom et avis requis");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("role", form.role.trim());
      data.append("text", form.text.trim());
      data.append("rating", String(form.rating));
      if (imageFile) data.append("files", imageFile);

      const { data: res } = await axios.post(`${API_BASE}/api/testimonials`, data);
      toast.success(res.message || "Merci ! Votre avis sera publié après validation.", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Échec de l'envoi", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Use admin-approved testimonials when available, otherwise the curated defaults
  const fallback = (() => {
    const list = t("testimonials", { returnObjects: true });
    return Array.isArray(list) ? list : TESTIMONIALS;
  })();
  const display = items && items.length > 0 ? items : fallback;

  return (
    <section className="home-section testimonials">
      <div className="home-section-head">
        <span className="home-eyebrow">{t("testi_eyebrow")}</span>
        <h2 className="home-title">
          {t("testi_title")} <em>{t("testi_title_em")}</em>
        </h2>
        <span className="home-rule" />
      </div>

      <div className="testimonials-grid">
        {display.map((item, idx) => (
          <figure className="testimonial-card" key={item._id || item.name || idx}>
            <div className="testimonial-stars">
              {"★★★★★".split("").slice(0, item.rating || 5).map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <blockquote>“{item.text}”</blockquote>
            {item.image?.path && (
              <img
                className="testimonial-photo"
                src={`${API_BASE}${item.image.path}`}
                alt={item.name}
              />
            )}
            <figcaption>
              <span className="testimonial-avatar">
                {(item.name || "?").charAt(0)}
              </span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.role}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="testimonial-cta">
        <button
          type="button"
          className="testimonial-share-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;
          {t("testi_share") !== "testi_share" ? t("testi_share") : "Partagez votre avis"}
        </button>
      </div>

      {showForm && (
        <form className="testimonial-form" onSubmit={submit}>
          <div className="testimonial-form-row">
            <input
              type="text"
              placeholder={t("testi_name") !== "testi_name" ? t("testi_name") : "Votre nom"}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder={t("testi_role") !== "testi_role" ? t("testi_role") : "Profession (optionnel)"}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <textarea
            placeholder={t("testi_text") !== "testi_text" ? t("testi_text") : "Votre avis…"}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={4}
          />
          <div className="testimonial-form-row testimonial-form-meta">
            <label className="testimonial-rating">
              {t("testi_rating") !== "testi_rating" ? t("testi_rating") : "Note"} :
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </label>
            <label className="testimonial-upload">
              <i className="fa fa-camera" aria-hidden="true"></i>&nbsp;
              {t("testi_photo") !== "testi_photo" ? t("testi_photo") : "Ajouter une photo"}
              <input type="file" accept="image/*" onChange={onImage} hidden />
            </label>
            {imagePreview && (
              <img className="testimonial-form-preview" src={imagePreview} alt="preview" />
            )}
          </div>
          <button type="submit" className="testimonial-submit" disabled={submitting}>
            {submitting
              ? "…"
              : t("testi_send") !== "testi_send"
              ? t("testi_send")
              : "Envoyer mon avis"}
          </button>
          <small className="testimonial-note">
            {t("testi_moderation") !== "testi_moderation"
              ? t("testi_moderation")
              : "Votre avis sera publié après validation par notre équipe."}
          </small>
        </form>
      )}
    </section>
  );
};

/* ---------------- Instagram gallery ---------------- */
const IG_IMAGES = [
  "/assets/products_carousel/1.jpeg",
  "/assets/products_carousel/2.jpeg",
  "/assets/products_carousel/3.jpeg",
  "/assets/products_carousel/4.jpeg",
  "/assets/products_carousel/5.jpeg",
  "/assets/products_carousel/6.jpeg",
];

// To show the REAL Instagram feed:
// 1. Create a free widget at https://lightwidget.com (connect @laghashop)
// 2. Paste the widget ID below (the number in the embed iframe URL).
// While empty, a curated fallback grid is shown.
const LIGHTWIDGET_ID = "";

export const InstagramGallery = () => {
  const { t } = useTranslation("home");
  return (
    <section className="home-section instagram">
      <div className="home-section-head">
        <span className="home-eyebrow">{t("ig_eyebrow")}</span>
        <h2 className="home-title">
          {t("ig_title")} <em>{t("ig_title_em")}</em>
        </h2>
        <span className="home-rule" />
      </div>

      {LIGHTWIDGET_ID ? (
        <iframe
          title="Instagram @laghashop"
          src={`//lightwidget.com/widgets/${LIGHTWIDGET_ID}.html`}
          scrolling="no"
          allowtransparency="true"
          className="lightwidget-widget"
          style={{ width: "100%", border: 0, overflow: "hidden" }}
        />
      ) : (
        <div className="instagram-grid">
          {IG_IMAGES.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/laghashop/"
              target="_blank"
              rel="noreferrer"
              className="instagram-cell"
            >
              <img src={src} alt={`Instagram ${i + 1}`} loading="lazy" />
              <span className="instagram-overlay">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </span>
            </a>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "var(--space-5)" }}>
        <a
          href="https://www.instagram.com/laghashop/"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp; {t("ig_btn")}
        </a>
      </div>
    </section>
  );
};

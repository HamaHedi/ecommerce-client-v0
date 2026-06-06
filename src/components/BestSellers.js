import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ProductRail from "./ProductRail";
import { API_BASE } from "../config";

const BestSellers = () => {
  const { t } = useTranslation("home");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API_BASE}/api/best-sellers`)
      .then(({ data }) => {
        if (active) setProducts(data.bestSellers || []);
      })
      .catch(() => active && setProducts([]));
    return () => {
      active = false;
    };
  }, []);

  if (!products.length) return null;

  return (
    <ProductRail
      eyebrow={t("bestseller_eyebrow") !== "bestseller_eyebrow" ? t("bestseller_eyebrow") : "Coup de cœur"}
      title={t("bestseller_title") !== "bestseller_title" ? t("bestseller_title") : "Meilleures ventes"}
      products={products}
    />
  );
};

export default BestSellers;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/productCard.css";
import { useTranslation } from "react-i18next";
import { Image } from "antd";
import { useGlobalState } from "../context/context";
import QuickViewModal from "./QuickViewModal";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  const { isInWishlist, toggleWishlist } = useGlobalState();
  const [quickOpen, setQuickOpen] = useState(false);

  const calculatePercentageReduction = (oldPrice, price) => {
    if (oldPrice && price) {
      return (((oldPrice - price) / oldPrice) * 100).toFixed(0) + "%";
    }
    return "";
  };

  const goToProduct = () => navigate(`/product/${product._id}`);
  const inWishlist = isInWishlist(product._id);
  const lowStock =
    product?.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <article className="product-card-container">
      {product?.oldPrice > 0 && (
        <span className="promo-percentage">
          -{calculatePercentageReduction(product?.oldPrice, product?.price)}
        </span>
      )}

      <button
        className={`product-wish ${inWishlist ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        aria-label="Ajouter aux favoris"
      >
        <i className={`fa ${inWishlist ? "fa-heart" : "fa-heart-o"}`}></i>
      </button>

      <Link
        to={`/product/${product._id}`}
        className="product-image-container"
      >
        <Image
          preview={false}
          rootClassName="product-image"
          fallback={`${
            product && product.images[0]
              ? "https://api.lagha.shop/" + product.images[0].path
              : ""
          }`}
        />
        <button
          className="product-quickview"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickOpen(true);
          }}
        >
          <i className="fa fa-eye" aria-hidden="true"></i> Aperçu rapide
        </button>
      </Link>

      <div className="product-card-body">
        <Link to={`/product/${product._id}`} className="product-title">
          {product?.brand}
        </Link>

        <Link to={`/product/${product._id}`} className="product-name">
          {product?.name}
        </Link>

        {lowStock && (
          <span className="product-lowstock">
            <i className="fa fa-fire" aria-hidden="true"></i> Plus que{" "}
            {product.stock} en stock
          </span>
        )}

        <div className="product-price-row">
          <span className="product-price">
            {product.price && product.price.toFixed(3)} Dt
          </span>
          {product.oldPrice !== 0 && (
            <span className="product-old-price">
              {product.oldPrice && product.oldPrice.toFixed(3)} Dt
            </span>
          )}
        </div>

        <button className="view-details-button" onClick={goToProduct}>
          {t("view_details")}
        </button>
      </div>

      <QuickViewModal
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </article>
  );
};

export default Product;

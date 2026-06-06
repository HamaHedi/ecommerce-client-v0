import React from "react";
import { Modal, Image } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { addItemToCart } from "../actions/cartActions";
import { useGlobalState } from "../context/context";
import "../styles/quickview.css";

const QuickViewModal = ({ product, open, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("product");
  const { isInWishlist, toggleWishlist } = useGlobalState();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discount =
    product.oldPrice > 0 && product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const img =
    product.images && product.images[0]
      ? "https://api.lagha.shop/" + product.images[0].path
      : "";

  const addToCart = () => {
    dispatch(addItemToCart(product._id, 1));
    toast.success(t("Item Added to Cart") || "Ajouté au panier", {
      position: toast.POSITION.TOP_RIGHT,
      className: "m-2",
    });
    onClose && onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      className="quickview-modal"
    >
      <div className="qv-grid">
        <div className="qv-media">
          {discount > 0 && <span className="qv-badge">-{discount}%</span>}
          <Image src={img} fallback={img} preview={false} />
        </div>
        <div className="qv-info">
          {product.brand && <span className="qv-brand">{product.brand}</span>}
          <h3 className="qv-name">{product.name}</h3>

          <div className="qv-price-row">
            <span className="qv-price">
              {product.price && Number(product.price).toFixed(3)} DT
            </span>
            {product.oldPrice > 0 && (
              <span className="qv-old">
                {Number(product.oldPrice).toFixed(3)} DT
              </span>
            )}
          </div>

          {product.stock !== undefined && (
            <span
              className={`qv-stock ${product.stock > 0 ? "in" : "out"}`}
            >
              {product.stock > 0
                ? product.stock <= 5
                  ? `Plus que ${product.stock} en stock`
                  : t("In Stock") !== "In Stock"
                  ? t("In Stock")
                  : "En stock"
                : t("Out of Stock") !== "Out of Stock"
                ? t("Out of Stock")
                : "Rupture de stock"}
            </span>
          )}

          {product.description && (
            <p
              className="qv-desc"
              dangerouslySetInnerHTML={{
                __html:
                  product.description.replace(/<[^>]+>/g, " ").slice(0, 180) +
                  "…",
              }}
            />
          )}

          <div className="qv-actions">
            <button
              className="qv-add"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              {t("Add to Cart") !== "Add to Cart" ? t("Add to Cart") : "Ajouter au panier"}
            </button>
            <button
              className={`qv-wish ${inWishlist ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
            >
              <i className={`fa ${inWishlist ? "fa-heart" : "fa-heart-o"}`}></i>
            </button>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="qv-details-link"
            onClick={onClose}
          >
            {t("view_details") !== "view_details"
              ? t("view_details")
              : "Voir tous les détails"}{" "}
            →
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;

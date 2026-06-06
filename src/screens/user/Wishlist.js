import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Product from "../../components/Product";
import { useGlobalState } from "../../context/context";
import "../../styles/wishlist.css";

const Wishlist = () => {
  const { wishlist } = useGlobalState();
  const { t } = useTranslation("product");

  return (
    <section className="wishlist-page">
      <div className="wishlist-head">
        <span className="home-eyebrow">Vos favoris</span>
        <h1 className="wishlist-title">
          Ma <em>liste de souhaits</em>
        </h1>
        <p>
          {wishlist.length} {wishlist.length > 1 ? "articles" : "article"}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <i className="fa fa-heart-o" aria-hidden="true"></i>
          <h3>Votre liste est vide</h3>
          <p>Ajoutez vos produits préférés en cliquant sur le cœur.</p>
          <Link to="/" className="btn-brand">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;

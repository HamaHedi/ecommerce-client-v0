import React from "react";
import Product from "./Product";
import "../styles/product-rail.css";

const ProductRail = ({ title, eyebrow, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <section className="product-rail">
      <div className="product-rail-head">
        {eyebrow && <span className="home-eyebrow">{eyebrow}</span>}
        <h2 className="product-rail-title">{title}</h2>
      </div>
      <div className="product-rail-track">
        {products.map((p) => (
          <div className="product-rail-item" key={p._id}>
            <Product product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRail;

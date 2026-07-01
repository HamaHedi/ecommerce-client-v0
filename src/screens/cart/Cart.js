import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import { useTranslation } from "react-i18next";
import "../../styles/checkout.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("cart");

  const { cartItems } = useSelector((state) => state.cart);
  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;

    if (newQty > stock) return;

    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;

    if (newQty <= 0) return;

    dispatch(addItemToCart(id, newQty));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <section className="container my-4 cart-page" style={{ width: "100%" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div
              className="card card-registration card-registration-2 shadow"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-12 col-sm-12 col-lg-8">
                    <div className="cart-items-panel">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0 text-black">
                          {t("Shopping_Cart")}
                        </h3>
                        <span className="cart-count-pill">
                          {cartItems.length} {t("items")}
                        </span>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="cart-empty">
                          <i className="fas fa-shopping-cart"></i>
                          <p className="mt-3 mb-0">{t("Your cart is empty")}</p>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div className="cart-item" key={item.product}>
                            <button
                              className="cart-item-remove"
                              aria-label="Remove item"
                              onClick={() =>
                                removeCartItemHandler(item.product)
                              }
                            >
                              <i className="fas fa-times"></i>
                            </button>

                            <Link
                              to={`/product/${item.product}`}
                              className="cart-item-thumb"
                            >
                              <img
                                src={"https://api.lagha.shop" + item.image}
                                alt={item.name}
                              />
                            </Link>

                            <div className="cart-item-info">
                              <Link
                                to={`/product/${item.product}`}
                                className="cart-item-name"
                              >
                                {item.name}
                              </Link>

                              <div className="cart-item-meta">
                                {item?.color && (
                                  <span className="cart-item-attr">
                                    {item.color}
                                  </span>
                                )}
                                {item?.size && (
                                  <span className="cart-item-attr">
                                    {item.size}
                                  </span>
                                )}
                                {item?.volume && (
                                  <span className="cart-item-attr">
                                    {item.volume}
                                    {item?.volumeRef ? ` (${item.volumeRef})` : ""}
                                  </span>
                                )}
                              </div>

                              {item?.teint && (
                                <div className="cart-item-teint">
                                  <span>Teinte sélectionnée</span>
                                  <img src={item.teint} alt="Selected teint" />
                                </div>
                              )}
                            </div>

                            <div className="cart-item-qty">
                              <div className="input-group text-nowrap">
                                <button
                                  className="btn btn-sm btn-link px-2"
                                  type="button"
                                  onClick={() =>
                                    decreaseQty(item.product, item.quantity)
                                  }
                                >
                                  <i className="fa fa-minus" aria-hidden="true"></i>
                                </button>

                                <input
                                  type="text"
                                  className="form-control form-control-sm text-center count bg-white"
                                  value={item.quantity}
                                  readOnly
                                />

                                <button
                                  className="btn btn-sm btn-link px-2"
                                  type="button"
                                  onClick={() =>
                                    increaseQty(
                                      item.product,
                                      item.quantity,
                                      item.stock
                                    )
                                  }
                                >
                                  <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                              </div>
                            </div>

                            <div className="cart-item-price">
                              DT {item.price && item.price.toFixed(2)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-lg-4 summary">
                    <div className="p-5">
                      <h3 className="fw-bold mt-2 pt-1">{t("Summary")}</h3>
                      <hr className="my-4" />

                      <div className="summary-row">
                        <span className="summary-label">{t("Subtotal")}</span>
                        <span className="summary-value">
                          {totalUnits} ({t("Units")})
                        </span>
                      </div>

                      <div className="summary-total">
                        <span className="summary-total-label">
                          {t("Total price")}
                        </span>
                        <span className="summary-total-value">
                          DT {totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-block btn-lg cart-checkout-btn"
                        onClick={checkoutHandler}
                        disabled={cartItems.length === 0 ? true : false}
                      >
                        {t("CHECK OUT")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/checkout.css";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const { t } = useTranslation("cart");

  const steps = [
    { key: "cart", label: t("Cart") !== "Cart" ? t("Cart") : "Panier", to: "/cart", done: true },
    { key: "shipping", label: t("Shipping"), to: "/shipping", done: shipping },
    {
      key: "confirm",
      label: t("Confirm Order"),
      to: "/confirm",
      done: confirmOrder,
    },
  ];

  return (
    <div className="checkout-steps">
      {steps.map((step, i) => {
        const Wrapper = step.done ? Link : "span";
        return (
          <React.Fragment key={step.key}>
            {i > 0 && (
              <span
                className={`checkout-line ${
                  steps[i].done ? "is-active" : ""
                }`}
              />
            )}
            <Wrapper
              to={step.to}
              className={`checkout-step ${step.done ? "is-active" : ""}`}
            >
              <span className="checkout-step-num">
                {step.done ? <i className="fa fa-check" /> : i + 1}
              </span>
              <span className="checkout-step-label">{step.label}</span>
            </Wrapper>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;

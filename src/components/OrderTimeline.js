import React from "react";
import "../styles/order-timeline.css";

const STEPS = [
  { key: "placed", label: "Commande passée", icon: "fa-shopping-bag" },
  { key: "Processing", label: "Confirmée", icon: "fa-check" },
  { key: "Shipped", label: "Expédiée", icon: "fa-truck" },
  { key: "Delivered", label: "Livrée", icon: "fa-home" },
];

const ORDER = ["Processing", "Shipped", "Delivered"];

const OrderTimeline = ({ status }) => {
  const s = String(status || "Processing");
  const cancelled = s.toLowerCase().includes("cancel") || s.toLowerCase().includes("annul");
  // index in ORDER; "placed" (step 0) is always complete
  const statusIndex = cancelled ? 0 : ORDER.indexOf(s) + 1; // 1..3

  if (cancelled) {
    return (
      <div className="order-timeline cancelled">
        <span className="order-cancelled-badge">
          <i className="fa fa-times-circle"></i> Commande annulée
        </span>
      </div>
    );
  }

  return (
    <div className="order-timeline">
      {STEPS.map((step, i) => {
        const done = i <= statusIndex;
        const current = i === statusIndex;
        return (
          <div
            key={step.key}
            className={`ot-step ${done ? "done" : ""} ${current ? "current" : ""}`}
          >
            {i > 0 && <span className={`ot-line ${i <= statusIndex ? "done" : ""}`} />}
            <span className="ot-node">
              <i className={`fa ${step.icon}`} aria-hidden="true"></i>
            </span>
            <span className="ot-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;

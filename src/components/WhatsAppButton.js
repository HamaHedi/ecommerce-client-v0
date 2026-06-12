import React from "react";
import "../styles/whatsapp.css";

// Update this number to the shop's WhatsApp (international format, no +, no spaces)
export const WHATSAPP_NUMBER = "21620297772";

const WhatsAppButton = () => {
  const message = encodeURIComponent(
    "Bonjour Bianas 👋, je souhaite passer une commande / avoir des informations."
  );
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      className="whatsapp-fab"
      target="_blank"
      rel="noreferrer"
      aria-label="Commander sur WhatsApp"
    >
      <i className="fa fa-whatsapp" aria-hidden="true"></i>
      <span className="whatsapp-fab-label">Commander</span>
    </a>
  );
};

export default WhatsAppButton;

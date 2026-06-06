import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import "../styles/notify.css";

const NotifyBackInStock = ({ productId }) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE}/api/products/${productId}/notify`, {
        email,
      });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="notify-box done">
        <i className="fa fa-check-circle" aria-hidden="true"></i>
        Parfait ! Nous vous préviendrons dès le retour en stock.
      </div>
    );
  }

  return (
    <div className="notify-box">
      <p className="notify-title">
        <i className="fa fa-bell-o" aria-hidden="true"></i> Prévenez-moi du
        retour en stock
      </p>
      <form className="notify-form" onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "…" : "M'avertir"}
        </button>
      </form>
      {error && <small className="notify-error">{error}</small>}
    </div>
  );
};

export default NotifyBackInStock;

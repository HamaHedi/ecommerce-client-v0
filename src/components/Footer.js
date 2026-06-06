import React, { useEffect, useState } from "react";
import "../styles/footer.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import { ReactComponent as EmailIcon } from "../screens/contact/envelope-solid.svg";
import { ReactComponent as PhoneIcon } from "../screens/contact/mobile-screen-button-solid.svg";
import { ReactComponent as AdressIcon } from "../screens/contact/location-arrow-solid.svg";
import { ReactComponent as FasebookIcon } from "./square-facebook.svg";
import { ReactComponent as InstagramIcon } from "./instagram.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, newsletterSubscription } from "../actions/userActions";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const position = [35.72917, 10.58082];
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslation("footer");

  const { error, message } = useSelector((state) => state.newsLetter);
  useEffect(() => {
    if (error) {
      toast.error(error?.message, {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch(clearErrors());
    }

    if (message) {
      toast.success("Subscription done", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
    }
  }, [dispatch, error, message]);

  const handleNewsletter = () => {
    dispatch(newsletterSubscription(email));
  };

  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="footer-title">{t("contact_us")}</h3>
          <span className="footer-line">
            <AdressIcon /> Cite commerciale msaken 4070
          </span>
          <span className="footer-line">
            <EmailIcon /> contact.Bianas.business@gmail.com
          </span>
          <span className="footer-line">
            <PhoneIcon /> +216 73258310
          </span>
        </div>

        <div className="footer-col">
          <h3 className="footer-title">{t("share_with_us")}</h3>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/lagha.shop1/"
              aria-label="Facebook"
            >
              <FasebookIcon />
            </a>
            <a
              href="https://www.instagram.com/laghashop/"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-map-info">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "220px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={defaultIcon}>
                <Popup>{t("our_store_location")}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="footer-col newsletter-subscription-container">
          <h3 className="footer-title">{t("newsletter")}</h3>
          <p className="newsletter-copy">{t("subscribe_our_newsletter")}</p>
          <div className="newsletter-field">
            <input
              type="email"
              required
              className="newsletter-email"
              placeholder={t("enter your email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="newsletter-button" onClick={handleNewsletter}>
              {t("subscribe")}
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} lagha.shop — Tous droits réservés
      </div>
    </footer>
  );
};

export default Footer;

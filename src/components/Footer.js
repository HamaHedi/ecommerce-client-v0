import React, { useEffect, useState } from "react";
import "../styles/footer.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
// import "../styles/footer.css"
import { ReactComponent as EmailIcon } from "../screens/contact/envelope-solid.svg";
import { ReactComponent as PhoneIcon } from "../screens/contact/mobile-screen-button-solid.svg";
import { ReactComponent as AdressIcon } from "../screens/contact/location-arrow-solid.svg";
import { ReactComponent as FasebookIcon } from "./square-facebook.svg";
import { ReactComponent as InstagramIcon } from "./instagram.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, newsletterSubscription } from "../actions/userActions";
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const position = [35.72917, 10.58082];
  const [email, setEmail] = useState("");
  const dispatch = useDispatch()
  const { t } = useTranslation('footer')

  const { error, message } = useSelector((state) => state.newsLetter)
  useEffect(() => {

    if (error) {
      toast.error(error?.message, {
        position: toast.POSITION.TOP_RIGHT,
        className: 'm-2',
      })
      dispatch(clearErrors())
    }

    if (message) {
      toast.success("Subscription done", {
        position: toast.POSITION.TOP_RIGHT,
        className: 'm-2',
      })
    }
  }, [dispatch, error, message])
  const handleNewsletter = () => {
    dispatch(newsletterSubscription(email))
  }
  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  return (
    <footer
      class="relative pt-8 pb-6"
      style={{
        background: "#f9c3bb",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "100px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "#1a1a1a",
            fontSize: "25px",
            position: "relative",
            marginBottom: "5px",
            fontFamily: "Montserrat",
            fontWeight: "500",
            letterSpacing: "0.9px",
          }}
        >
          {t("contact_us")}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <AdressIcon /> Cite commerciale msaken 4070
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <EmailIcon /> contact.Bianas.business@gmail.com
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <PhoneIcon /> +216 73258310
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "#1a1a1a",
            fontSize: "25px",
            position: "relative",
            marginBottom: "5px",
            fontWeight: "500",
            letterSpacing: "0.9px",
            fontFamily: "Montserrat",
          }}
        >
          {t("share_with_us")}
        </span>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <a href="https://www.facebook.com/lagha.shop1/"><FasebookIcon /></a>
          <a href="https://www.instagram.com/laghashop/"><InstagramIcon /></a>
        </div>
      </div>
      <div className="footer-map-info">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={defaultIcon}>
            <Popup>          {t("our_store_location")}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="newsletter-subscription-container">
        <span
          style={{
            color: "#1a1a1a",
            fontSize: "25px",
            position: "relative",
            marginBottom: "15px",
            fontWeight: "500",
            letterSpacing: "0.9px",
            fontFamily: "Montserrat",
          }}
        >
          {t("newsletter")}{" "}
        </span>
        <p
          style={{
            color: "#1a1a1a",
            fontSize: "16px",
            position: "relative",
            marginBottom: "5px",
            fontWeight: "500",
            letterSpacing: "0.9px",
            fontFamily: "Montserrat",
          }}
        >
          {t("subscribe_our_newsletter")}        </p>
        <input
          type="email"
          required
          className="newsletter-email"
          placeholder={t("enter your email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="login-button" onClick={handleNewsletter}>
          {t("subscribe")}
        </button>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";

import "../../styles/contact.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet"; // Import Leaflet library
import { ReactComponent as EmailIcon } from "./envelope-solid.svg";
import { ReactComponent as PhoneIcon } from "./mobile-screen-button-solid.svg";
import { ReactComponent as AdressIcon } from "./location-arrow-solid.svg";
import { useTranslation } from 'react-i18next'

const Contact = () => {
  const position = [35.72917, 10.58082];
  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const { t } = useTranslation('contact')

  return (
    <>
      <div className="background-image-container">
        <span className="login-title">{t("Contact")}</span>
        <span className="login-subtitle">{t("Home")} / {t("Contact")}</span>
      </div>
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "70%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={defaultIcon}>
            <Popup>{t("Our store location")}</Popup>
          </Marker>
        </MapContainer>

        <div className="contact-info-container">
          <div className="phone-contact">
            <div className="icon-container">
              <PhoneIcon />
            </div>
            <span className="title">{t("PHONE")}</span>
            <span>Phone: 27220666</span>
            <span>Fax: 73258310</span>
          </div>
          <div className="email-contact">
            <div className="icon-container">
              <EmailIcon />
            </div>
            <span className="title">{t("EMAIL")}</span>

            <span>buddha@example.com</span>
            <span>support@example.com</span>
          </div>
          <div className="address-contact">
            <div className="icon-container">
              <AdressIcon />
            </div>
            <span className="title">{t("ADDRESS")}</span>

            <span>No: Cite commerciale msaken 4070</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

import React, { useState } from "react";

import "../../styles/contact.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet"; // Import Leaflet library
import { ReactComponent as EmailIcon } from "./envelope-solid.svg";
import { ReactComponent as PhoneIcon } from "./mobile-screen-button-solid.svg";
import { ReactComponent as AdressIcon } from "./location-arrow-solid.svg";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../actions/userActions";
import { toast } from "react-toastify";

const Contact = () => {
  const position = [35.72917, 10.58082];
  const dispatch = useDispatch();
  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const { t } = useTranslation("contact");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    dispatch(sendMessage({ email: email, name: name, message: message }))
      .unwrap()
      .then(() =>
        toast.success("Message sent successfully", {
          position: toast.POSITION.TOP_RIGHT,
          className: "m-2",
        })
      );
  };
  return (
    <>
      <div className="background-image-container">
        <span className="login-title">{t("Contact")}</span>
        <span className="login-subtitle">
          {t("Home")} / {t("Contact")}
        </span>
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
        <div className="contacts-container">
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

              <span>contact.Bianas.business@gmail.com</span>
            </div>
            <div className="address-contact">
              <div className="icon-container">
                <AdressIcon />
              </div>
              <span className="title">{t("ADDRESS")}</span>

              <span>No: Cite commerciale msaken 4070</span>
            </div>
          </div>
          <div className="contact-form-container">
            <span className="contact-form-title">Contact Form</span>
            <input
              type="email"
              required
              className="login-input"
              placeholder={"Name"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="email"
              required
              className="login-input"
              placeholder={"Email"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              required
              style={{ height: "200px" }}
              className="login-input"
              placeholder={"Message"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="login-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

import React from "react";
import "../styles/footer.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet"; // Import Leaflet library
// import "../styles/footer.css"
import { ReactComponent as EmailIcon } from "../screens/contact/envelope-solid.svg";
import { ReactComponent as PhoneIcon } from "../screens/contact/mobile-screen-button-solid.svg";
import { ReactComponent as AdressIcon } from "../screens/contact/location-arrow-solid.svg";
import { ReactComponent as FasebookIcon } from "./square-facebook.svg";
import { ReactComponent as InstagramIcon } from "./instagram.svg";
const Footer = () => {
  const position = [35.72917, 10.58082];
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
	   gap:"25px",
        justifyContent: "space-around",
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
          Contact us
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <AdressIcon /> 520,West valey, Anim ad minim,
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <EmailIcon /> +80 1234567890
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <PhoneIcon /> mail@example.com
        </span>
      </div>
      <div   style={{
            display: "flex",
			flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}>
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
          Share with us
        </span>
        <div
          style={{
            display: "flex",
			justifyContent:"center",
			gap: "10px",
          }}
        >
          
          <FasebookIcon />
          <InstagramIcon />
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
            <Popup>Our store location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";

import "../../styles/contact.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet'; // Import Leaflet library

const Contact = () => {
    const position = [ 35.7291700, 10.5808200]
    const defaultIcon = L.icon({
        iconUrl: icon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }); 
  return (
    <>
      <div className="background-image-container">
        <span className="login-title">Contact</span>
        <span className="login-subtitle">Home / Contact</span>
      </div>
      <div className="map-container"> 

      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '70%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    </>
  );
};

export default Contact;

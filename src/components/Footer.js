import React from 'react'
import "../styles/footer.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet"; // Import Leaflet library
const Footer = () => {
	const position = [35.72917, 10.58082];
	const defaultIcon = L.icon({
	  iconUrl: icon,
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	});
	return (
		<footer class="relative pt-8 pb-6" style={{background:"#f9c3bb"}}>
		<div class="container mx-auto px-4">
		  <div class="flex flex-wrap text-left lg:text-left">
			<div class="w-full lg:w-6/12 px-4">
			  <h4 class="text-3xl fonat-semibold text-blueGray-700" style={{color:"#333333"}}>Let's keep in touch!</h4>
			  <h5 class="text-lg mt-0 mb-2 text-blueGray-600" style={{color:"#333333"}}>
				Find us on any of these platforms, we respond 1-2 business days.
			  </h5>
			  <div class="mt-6 lg:mb-0 mb-6">
				<button class="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
				  <i class="fab fa-twitter"></i></button><button class="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
				  <i class="fab fa-facebook-square"></i></button>
				
			  </div>
			</div>
			<div class="w-full lg:w-6/12 px-4">
			  {/* <div class="flex flex-wrap items-top mb-6">
				<div class="w-full lg:w-4/12 px-4 ml-auto">
				  <span class="block uppercase text-blueGray-500 text-sm font-semibold mb-2" style={{color:"#333333"}}>Useful Links</span>
				  <ul class="list-unstyled">
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://www.creative-tim.com/presentation?ref=njs-profile" style={{color:"#333333"}}>About Us</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://blog.creative-tim.com?ref=njs-profile" style={{color:"#333333"}}>Blog</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://www.github.com/creativetimofficial?ref=njs-profile" style={{color:"#333333"}}>Github</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile" style={{color:"#333333"}}>Free Products</a>
					</li>
				  </ul>
				</div>
				<div class="w-full lg:w-4/12 px-4">
				  <span class="block uppercase text-blueGray-500 text-sm font-semibold mb-2" style={{color:"#333333"}}>Other Resources</span>
				  <ul class="list-unstyled">
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://github.com/creativetimofficial/notus-js/blob/main/LICENSE.md?ref=njs-profile" style={{color:"#333333"}}>MIT License</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://creative-tim.com/terms?ref=njs-profile" style={{color:"#333333"}}>Terms &amp; Conditions</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://creative-tim.com/privacy?ref=njs-profile" style={{color:"#333333"}}>Privacy Policy</a>
					</li>
					<li>
					  <a class="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="https://creative-tim.com/contact-us?ref=njs-profile" style={{color:"#333333"}}>Contact Us</a>
					</li>
				  </ul>
				</div>
			  </div> */}
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
		  </div>
		  {/* <div class="flex flex-wrap items-center md:justify-between justify-center">
			<div class="w-full md:w-4/12 px-4 mx-auto text-center">
			  <div class="text-sm  font-semibold py-1" style={{color:"#333333"}}>
				Copyright © <span id="get-current-year">2024</span><a href="https://www.creative-tim.com/product/notus-js" class="text-blueGray-500 hover:text-gray-800" target="_blank" style={{color:"#333333"}} /> Notus JS by
			  </div>
			</div>
		  </div> */}
		</div>
	  </footer>

	)
}

export default Footer

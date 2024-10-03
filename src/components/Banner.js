import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
const Banner = () => {
	return (


		<Carousel autoPlay infiniteLoop interval={5000} emulateTouch>
			<div>
				<img src="/7050318-01.jpg" style={{ maxHeight: "671px" }} />
			</div>
			<div>
				<img src="/affiche_web_together.jpeg" />
			</div>
			<div>
				<img src="/cover.jpg" />
			</div>
		</Carousel>



	)
}

export default Banner

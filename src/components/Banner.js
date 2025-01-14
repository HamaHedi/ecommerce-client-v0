import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
const Banner = () => {
	return (


		<Carousel autoPlay infiniteLoop interval={5000} emulateTouch>
			<div>
				<img src="/banner1.jpeg" style={{ maxHeight: "671px" }} />
			</div>
			<div>
				<img src="/banner2.jpeg" />
			</div>
			<div>
				<img src="/banner3.jpeg" />
			</div>
		</Carousel>



	)
}

export default Banner

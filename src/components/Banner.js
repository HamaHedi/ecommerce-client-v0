import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
const Banner = () => {
	return (


		<Carousel autoPlay infiniteLoop>
			<div>
				<img src="/cover1.jpeg" />
			</div>
			<div>
				<img src="/cover2.jpeg" />
			</div>
			<div>
				<img src="/1.png" />
			</div>
		</Carousel>



	)
}

export default Banner

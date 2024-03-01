import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const Banner = () => {
	return (
		

		<Carousel autoPlay infiniteLoop>
		<div>
			<img src="/1.png" />
		</div>
		<div>
			<img src="/1.png" />
		</div>
		<div>
			<img src="/1.png" />
		</div>
	</Carousel>



	)
}

export default Banner

import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
const Banner = () => {
	return (


		<Carousel autoPlay infiniteLoop >
			<div>
				<img src="/affiche_web_together_copy.jpeg" />
			</div>
			<div>
				<img src="/affiche_web_together_copy.jpeg" />
			</div>
			<div>
				<img src="/affiche_web_together_copy.jpeg" />
			</div>
		</Carousel>



	)
}

export default Banner

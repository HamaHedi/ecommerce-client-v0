import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
const Banner = () => {
	return (


		<Carousel autoPlay infiniteLoop>
			<div>
				<img src="/1.png" />
				<span class="carousel-caption">Premium Cosmetics that Nourish Your Skin and Respect the Environment</span>
			</div>
			<div>
				<img src="/1.png" />
				<span class="carousel-caption">Luxurious Beauty Products that Embrace Natural Ingredients and Environmental Responsibility</span>
			</div>
			<div>
				<img src="/1.png" />
				<span class="carousel-caption">High-Quality Cosmetics that Enhance Your Beauty while Promoting Sustainability</span>
			</div>
		</Carousel>



	)
}

export default Banner

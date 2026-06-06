import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "../styles/carousel.css"
import { API_BASE } from '../config'

// Fallback banners (used when none are configured in the admin)
const FALLBACK = [
	{ _id: 'f1', image: { path: '/banner1.jpeg' }, host: '' },
	{ _id: 'f2', image: { path: '/banner2.jpeg' }, host: '' },
	{ _id: 'f3', image: { path: '/banner3.jpeg' }, host: '' },
]

const Banner = () => {
	const [banners, setBanners] = useState(null)

	useEffect(() => {
		axios
			.get(`${API_BASE}/api/banners`)
			.then(({ data }) => {
				if (data?.banners?.length) {
					setBanners(data.banners.map((b) => ({ ...b, host: API_BASE })))
				} else {
					setBanners(FALLBACK)
				}
			})
			.catch(() => setBanners(FALLBACK))
	}, [])

	const list = banners || FALLBACK

	return (
		<Carousel autoPlay infiniteLoop interval={5000} emulateTouch showThumbs={false}>
			{list.map((b) => {
				const src = `${b.host || ''}${b.image?.path || ''}`
				const img = (
					<img src={src} alt={b.title || 'banner'} style={{ maxHeight: '671px' }} />
				)
				return (
					<div key={b._id}>
						{b.link ? <a href={b.link}>{img}</a> : img}
						{(b.title || b.subtitle) && (
							<div className="banner-caption">
								{b.title && <h2>{b.title}</h2>}
								{b.subtitle && <p>{b.subtitle}</p>}
							</div>
						)}
					</div>
				)
			})}
		</Carousel>
	)
}

export default Banner

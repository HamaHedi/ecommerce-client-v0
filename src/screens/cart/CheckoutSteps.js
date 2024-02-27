import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
	return (
		<div className='checkout-progress d-flex justify-content-center mt-5'>
			{shipping ? (
				<Link to='/shipping' className='float-right'>
					<div className='triangle2-active'></div>
					<div className='step active-step'>Shipping</div>
					<div className='triangle-active'></div>
				</Link>
			) : (
				<span disabled>
					<div className='triangle2-incomplete'></div>
					<div className='step incomplete'>Shipping</div>
					<div className='triangle-incomplete'></div>
				</span>
			)}

			{confirmOrder ? (
				<Link to='/order/confirm' className='float-right'>
					<div className='triangle2-active'></div>
					<div className='step active-step'>Confirm Order</div>
					<div className='triangle-active'></div>
				</Link>
			) : (
				<span disabled>
					<div className='triangle2-incomplete'></div>
					<div className='step incomplete'>Confirm Order</div>
					<div className='triangle-incomplete'></div>
				</span>
			)}
		</div>
	)
}

export default CheckoutSteps

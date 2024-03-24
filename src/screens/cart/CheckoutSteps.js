import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
	const { t } = useTranslation('cart')

	return (
		<div className='checkout-progress d-flex justify-content-center mt-5'>
			{shipping ? (
				<Link to='/shipping' className='float-right'>
					<div className='triangle2-active'></div>
					<div className='step active-step'>{t("Shipping")}</div>
					<div className='triangle-active'></div>
				</Link>
			) : (
				<span disabled>
					<div className='triangle2-incomplete'></div>
					<div className='step incomplete'>{t("Shipping")}</div>
					<div className='triangle-incomplete'></div>
				</span>
			)}

			{confirmOrder ? (
				<Link to='/order/confirm' className='float-right'>
					<div className='triangle2-active'></div>
					<div className='step active-step'>{t("Confirm Order")}</div>
					<div className='triangle-active'></div>
				</Link>
			) : (
				<span disabled>
					<div className='triangle2-incomplete'></div>
					<div className='step incomplete'>{t("Confirm Order")}</div>
					<div className='triangle-incomplete'></div>
				</span>
			)}
		</div>
	)
}

export default CheckoutSteps

import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { toast } from 'react-toastify'

const ConfirmOrder = () => {
	const { cartItems, shippingInfo } = useSelector((state) => state.cart)
	const { user } = useSelector((state) => state.auth)
	const { error } = useSelector((state) => state.newOrder)
	const { t } = useTranslation('cart')

	const navigate = useNavigate()
	const dispatch = useDispatch()

	// Calculate Order Prices
	const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
	const shippingPrice = itemsPrice > 200 ? 0 : 25
	const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
	const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

	const order = {
		orderItems: cartItems,
		shippingInfo,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	}

	const processToPayment = () => {
		const data = {
			itemsPrice: itemsPrice.toFixed(2),
			shippingPrice,
			taxPrice,
			totalPrice,
		}

		dispatch(createOrder(order))

		toast.success('Your Order has been placed successfully', {
			position: toast.POSITION.TOP_RIGHT,
			className: 'm-2',
		})

		sessionStorage.setItem('orderInfo', JSON.stringify(data))
		navigate('/')
	}

	useEffect(() => {
		if (error) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}
	}, [dispatch, error])

	return (
		<section className='container my-4'>
			<CheckoutSteps shipping confirmOrder />

			<div className='row d-flex justify-content-between'>
				<div className='col-12 col-lg-8 mt-5 order-confirm'>
					<h4 className='mb-3'>{t("Shipping Info")}</h4>
					<p>
						<b>{t("Name")}:</b> {user && user.name}
					</p>
					<p>
						<b>{t("Phone")}:</b> {shippingInfo.phoneNo}
					</p>
					<p className='mb-4'>
						<b>{t("Address")}:</b>{' '}
						{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
					</p>

					<hr />
					<h4 className='mt-4'>{t("Your Cart Items")}:</h4>

					{cartItems.map((item) => (
						<Fragment>
							<hr />
							<div className='cart-item my-1' key={item.product}>
								<div className='row'>
									<div className='col-4 col-lg-2'>
										<img src={'http://localhost:8000/' + item.image} alt='Laptop' height='45' width='65' />
									</div>

									<div className='col-5 col-lg-6'>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</div>

									<div className='col-4 col-lg-4 mt-4 mt-lg-0'>
										<p>
											{item.quantity} x DT {item.price && item.price.toFixed(2)}{' '}
											= <b>DT {(item.quantity * item.price).toFixed(2)}</b>
										</p>
									</div>
								</div>
							</div>
							<hr />
						</Fragment>
					))}
				</div>

				<div className='col-12 col-lg-3 my-4'>
					<div id='order_summary'>
						<h4>{t("Order Summary")}</h4>
						<hr />
						<p>
							{t("Subtotal")}:{' '}
							<span className='order-summary-values'>
								DT {itemsPrice && itemsPrice.toFixed(2)}
							</span>
						</p>
						<p>
							{t("Shipping")}:{' '}
							<span className='order-summary-values'>
								DT {shippingPrice && shippingPrice.toFixed(2)}
							</span>
						</p>
						<p>
							{t("Tax")}:{' '}
							<span className='order-summary-values'>
								DT {taxPrice && taxPrice.toFixed(2)}
							</span>
						</p>

						<hr />

						<p>
							{t("Total")}:{' '}
							<span className='order-summary-values'>
								DT {totalPrice && totalPrice}
							</span>
						</p>

						<hr />
						<button
							id='checkout_btn'
							className='btn btn-primary btn-block'
							onClick={processToPayment}
						>
							{t("Confirm")}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ConfirmOrder

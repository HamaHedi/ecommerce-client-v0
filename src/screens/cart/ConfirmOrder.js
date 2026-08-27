import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { clearCart } from '../../actions/cartActions'
import { toast } from 'react-toastify'
import { API_BASE, GOVERNORATES, FREE_SHIPPING_THRESHOLD } from '../../config'

const ConfirmOrder = () => {
	const { cartItems, shippingInfo } = useSelector((state) => state.cart)
	const { user } = useSelector((state) => state.auth)
	const { error } = useSelector((state) => state.newOrder)
	const { t } = useTranslation('cart')

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [couponInput, setCouponInput] = useState('')
	const [couponCode, setCouponCode] = useState('')
	const [discount, setDiscount] = useState(0)
	const [couponMsg, setCouponMsg] = useState(null)
	const [couponLoading, setCouponLoading] = useState(false)
	const [governorate, setGovernorate] = useState(shippingInfo?.governorate || '')

	// Calculate Order Prices
	const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
	const taxPrice = 0
	const gov = GOVERNORATES.find((g) => g.name === governorate)
	const baseShipping = gov ? gov.fee : 0
	const freeShipping = FREE_SHIPPING_THRESHOLD > 0 && itemsPrice >= FREE_SHIPPING_THRESHOLD
	const shippingPrice = freeShipping ? 0 : baseShipping
	const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discount)

	const applyCoupon = async () => {
		if (!couponInput.trim()) return
		setCouponLoading(true)
		setCouponMsg(null)
		try {
			const { data } = await axios.post(`${API_BASE}/api/coupon/validate`, {
				code: couponInput.trim(),
				cartTotal: itemsPrice,
			})
			setDiscount(data.discount)
			setCouponCode(data.coupon.code)
			setCouponMsg({
				type: 'success',
				text: `Code « ${data.coupon.code} » appliqué : -${data.discount.toFixed(2)} DT`,
			})
		} catch (err) {
			setDiscount(0)
			setCouponCode('')
			setCouponMsg({
				type: 'error',
				text: err?.response?.data?.message || 'Code promo invalide',
			})
		} finally {
			setCouponLoading(false)
		}
	}

	const removeCoupon = () => {
		setDiscount(0)
		setCouponCode('')
		setCouponInput('')
		setCouponMsg(null)
	}

	const order = {
		orderItems: cartItems,
		shippingInfo,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice: Number(totalPrice.toFixed(2)),
		couponCode,
		discount,
		deliveryGovernorate: governorate,
	}

	const processToPayment = () => {
		if (!governorate) {
			toast.error('Veuillez choisir votre gouvernorat de livraison', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			return
		}
		const data = {
			itemsPrice: itemsPrice.toFixed(2),
			shippingPrice,
			taxPrice,
			totalPrice: totalPrice.toFixed(2),
		}

		dispatch(createOrder(order))
		dispatch(clearCart())

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

					{cartItems.map((item, index) => (
						<Fragment key={`${item.product}-${item.teintRef || ''}-${index}`}>
							<hr />
							<div className='cart-item my-1'>
								<div className='row'>
									<div className='col-4 col-lg-2'>
										<img src={'https://api.lagha.shop/' + item.image} alt='Laptop' height='45' width='65' />
									</div>

									<div className='col-5 col-lg-6'>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
										{item?.volume && (
											<p className='mb-0 text-muted' style={{ fontSize: '13px' }}>
												Volume: {item.volume}
												{item?.volumeRef ? ` (Réf: ${item.volumeRef})` : ''}
											</p>
										)}
										{item?.teintRef && (
											<p className='mb-0 text-muted' style={{ fontSize: '13px' }}>
												Teinte: {item?.teintName ? `${item.teintName} - ` : ''}
												<b>{item.teintRef}</b>
											</p>
										)}
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
						<div className='co-field'>
							<label>Gouvernorat de livraison</label>
							<select className='co-select' value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
								<option value=''>Choisir…</option>
								{GOVERNORATES.map((g) => (<option key={g.name} value={g.name}>{g.name} — {g.fee} DT</option>))}
							</select>
						</div>
						<div className='co-field'>
							<label>Code promo</label>
							{couponCode ? (
								<div className='co-coupon-applied'><span><i className='fa fa-check-circle'></i> {couponCode}</span><button type='button' onClick={removeCoupon}>Retirer</button></div>
							) : (
								<div className='co-coupon'><input type='text' placeholder='Ex: BIANAS10' value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} /><button type='button' onClick={applyCoupon} disabled={couponLoading}>{couponLoading ? '…' : 'Appliquer'}</button></div>
							)}
							{couponMsg && <small className={`co-coupon-msg ${couponMsg.type}`}>{couponMsg.text}</small>}
						</div>
						<p>
							{t("Subtotal")}:{' '}
							<span className='order-summary-values'>
								DT {itemsPrice && itemsPrice.toFixed(2)}
							</span>
						</p>
						<p>
							{t("Shipping")}:{' '}
							<span className='order-summary-values'>
								{freeShipping ? <span style={{ color: 'var(--success)' }}>Gratuite</span> : governorate ? `DT ${shippingPrice.toFixed(2)}` : '—'}
							</span>
						</p>
						<p>
							{t("Tax")}:{' '}
							<span className='order-summary-values'>
								DT {taxPrice && taxPrice.toFixed(2)}
							</span>
						</p>
						{discount > 0 && (
							<p>Remise:{' '}<span className='order-summary-values' style={{ color: 'var(--brand-coral-deep)' }}>- DT {discount.toFixed(2)}</span></p>
						)}

						<hr />

						<p>
							{t("Total")}:{' '}
							<span className='order-summary-values'>
								DT {totalPrice.toFixed(2)}
							</span>
						</p>

						<hr />
						<button
							id='checkout_btn'
							className='btn btn-block cart-checkout-btn'
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

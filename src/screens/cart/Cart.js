import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { useTranslation } from 'react-i18next'

const Cart = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { t } = useTranslation('cart')

	const { cartItems } = useSelector((state) => state.cart)
	const removeCartItemHandler = (id) => {
		dispatch(removeItemFromCart(id))
	}

	const increaseQty = (id, quantity, stock) => {
		const newQty = quantity + 1

		if (newQty > stock) return

		dispatch(addItemToCart(id, newQty))
	}

	const decreaseQty = (id, quantity) => {
		const newQty = quantity - 1

		if (newQty <= 0) return

		dispatch(addItemToCart(id, newQty))
	}

	const checkoutHandler = () => {
		navigate('/login?redirect=shipping')
	}

	return (
		<section className='container my-4' style={{ width: "100%" }}>
			<div className='container py-5 h-100'>
				<div className='row d-flex justify-content-center align-items-center h-100'>
					<div className='col-12'>
						<div
							className='card card-registration card-registration-2 shadow'
							style={{ borderRadius: '15px' }}
						>
							<div className='card-body p-0'>
								<div className='row g-0'>
									<div className='col-12 col-sm-12 col-lg-8'>
										<div className='p-5'>
											<div className='d-flex justify-content-between align-items-center mb-5'>
												<h3 className='fw-bold mb-0 text-black'>
													{t("Shopping_Cart")}
												</h3>
												<h6 className='mb-0 text-muted text-nowrap'>
													{cartItems.length} {t("items")}
												</h6>
											</div>
											<hr className='my-4' />

											{cartItems.map((item) => (
												<span key={item.product}>
													<div className='row mb-4 d-flex justify-content-between align-items-center text-center'>
														<div className='col-md-2 col-lg-2 col-xl-2'>
															<Link to={`/product/${item.product}`}>
																<img
																	src={"https://api.lagha.shop/products" + item.image}
																	className='img-fluid rounded-3'
																	alt='Cotton T-shirt'
																/>
															</Link>
														</div>


														<div className='col-md-3 col-lg-3 col-xl-3'>
															<h6 className='text-black text-center my-3'>
																<Link
																	to={`/product/${item.product}`}
																	className='text-dark'
																>
																	{item.name}
																</Link>
															</h6>
														</div>

														<div className='col-md-4 col-lg-4 col-xl-4 d-flex'>
															<div className='input-group text-nowrap'>
																<div className='input-group-prepend'>
																	<button
																		className='btn btn-sm btn-link px-2 border'
																		type='button'
																		onClick={() =>
																			decreaseQty(
																				item.product,
																				item.quantity
																			)
																		}
																	>
																		<i
																			className='fa fa-minus'
																			aria-hidden='true'
																		></i>
																	</button>
																</div>

																<input
																	type='text'
																	className='form-control form-control-sm text-center count bg-white border'
																	value={item.quantity}
																	readOnly
																/>

																<div className='input-group-prepend'>
																	<button
																		className='btn btn-sm btn-link px-2 border'
																		type='button'
																		onClick={() =>
																			increaseQty(
																				item.product,
																				item.quantity,
																				item.stock
																			)
																		}
																	>
																		<i
																			className='fa fa-plus'
																			aria-hidden='true'
																		></i>
																	</button>
																</div>
															</div>
														</div>
														<div className='col-md-3 col-lg-3 col-xl-3'>
															<h6 className='text-black text-center my-3'>
																<span
																	className='text-dark'
																>
																	{item?.color}
																</span>
															</h6>
														</div>
														<div className='col-md-3 col-lg-3 col-xl-3'>
															<h6 className='text-black text-center my-3'>
																<span
																	className='text-dark'
																>
																	{item?.size}
																</span>
															</h6>
														</div>
														<div className='col-md-3 col-lg-3 col-xl-3'>
															<div className='d-flex justify-content-between'>
																<h6 className='my-4'>
																	DT
																	{item.price &&
																		item?.price?.toFixed(2)}
																</h6>

																<button
																	className='btn btn-link px-0 text-muted'
																	onClick={() =>
																		removeCartItemHandler(
																			item.product
																		)
																	}
																>
																	<i className='fas fa-times'></i>
																</button>
															</div>
														</div>
													</div>

													<hr className='my-4' />
												</span>
											))}
										</div>
									</div>

									<div className='col-12 col-sm-12 col-lg-4 summary'>
										<div className='p-5'>
											<h3 className='fw-bold mt-2 pt-1'>{t("Summary")}</h3>
											<hr className='my-4' />

											<div className='mb-4'>
												<h5 className='text-uppercase'>{t("Subtotal")}:</h5>
												<h5>
													{cartItems.reduce(
														(acc, item) => acc + Number(item.quantity),
														0
													)}{' '}
													({t("Units")})
												</h5>
											</div>

											<hr className='my-4' />

											<div className='mb-5'>
												<h5 className='text-uppercase'>{t("Total price")}</h5>
												<h5>
													DT{' '}
													{cartItems
														.reduce(
															(acc, item) =>
																acc + item.quantity * item.price,
															0
														)
														.toFixed(2)}
												</h5>
											</div>

											<button
												type='button'
												className='btn btn-dark btn-block btn-lg'
												onClick={checkoutHandler}
												disabled={cartItems.length === 0 ? true : false}
											>
												{t("CHECK OUT")}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Cart

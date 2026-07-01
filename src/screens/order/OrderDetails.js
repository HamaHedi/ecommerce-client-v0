import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Loader from '../../components/Loader'
import OrderTimeline from '../../components/OrderTimeline'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, clearErrors } from '../../actions/orderActions'

const OrderDetails = () => {
	const dispatch = useDispatch()
	const { id } = useParams()

	const { loading, error, order = {} } = useSelector((state) => state.orderDetails)
	const { shippingInfo, orderItems, user, totalPrice, orderStatus } = order

	useEffect(() => {
		dispatch(getOrderDetails(id))

		if (error) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}
	}, [dispatch, error, id])

	const shippingDetails =
		shippingInfo &&
		`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<div className='card border my-4'>
						<div className='card-header'>
							<h3 className='mb-0'>Order # {order._id}</h3>
						</div>
						<div className='card-body'>
							<h4 className='mb-4'>Suivi de la commande</h4>
							<OrderTimeline status={orderStatus} />
							<hr />
							<h4 className='mb-4'>Shipping Info</h4>
							<p>
								<b>Name:</b> {user && user.name}
							</p>
							<p>
								<b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
							</p>
							<p className='mb-4'>
								<b>Address:</b>
								{shippingDetails}
							</p>
							<p>
								<b>Amount:</b> DT {totalPrice && totalPrice.toFixed(2)}
							</p>

							<hr />

							<h4 className='my-4'>Order Status:</h4>
							<p
								className={
									order.orderStatus &&
										String(order.orderStatus).includes('Delivered')
										? 'text-success'
										: 'text-danger'
								}
							>
								<b>{orderStatus}</b>
							</p>

							<h4 className='my-4'>Order Items:</h4>

							<hr />
							<div className='cart-item my-1'>
								{orderItems &&
									orderItems.map((item) => (
										<div key={item.product} className='row my-5'>
											<div className='col-4 col-lg-2'>
												<img
													src={'https://api.lagha.shop/api/' + item.image}
													alt={item.name}
													height='45'
													width='65'
												/>
											</div>

											<div className='col-5 col-lg-5'>
												<Link
													to={`/products/${item.product}`}
													className='text-muted'
												>
													{item.name}
												</Link>
												{item?.volume && (
													<p className='mb-0 text-muted' style={{ fontSize: '13px' }}>
														Volume: {item.volume}
														{item?.volumeRef ? ` (Réf: ${item.volumeRef})` : ''}
													</p>
												)}
											</div>

											<div className='col-4 col-lg-2 mt-4 mt-lg-0'>
												<p>DT {item.price && item.price.toFixed(2)}</p>
											</div>

											<div className='col-4 col-lg-3 mt-4 mt-lg-0'>
												<p>{item.quantity} Piece(s)</p>
											</div>
										</div>
									))}
							</div>
							<hr />
						</div>
					</div>
				</Fragment>
			)}
		</section>
	)
}

export default OrderDetails

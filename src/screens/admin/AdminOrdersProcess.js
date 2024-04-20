import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'

const AdminOrdersProcess = () => {
	const [status, setStatus] = useState('')

	const dispatch = useDispatch()

	const { loading, order = {} } = useSelector((state) => state.orderDetails)
	const { shippingInfo, orderItems, user, totalPrice, orderStatus } = order
	const { error, isUpdated } = useSelector((state) => state.order)

	const { id } = useParams()

	useEffect(() => {
		dispatch(getOrderDetails(id))

		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isUpdated) {
			toast.success('Order updated successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch({ type: UPDATE_ORDER_RESET })
		}
	}, [dispatch, error, isUpdated, id])

	const updateOrderHandler = (id) => {
		const formData = new FormData()
		formData.set('status', status === '' ? orderStatus : status)

		dispatch(updateOrder(id, formData))
	}

	const shippingDetails =
		shippingInfo &&
		`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

	return (
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='orders' />
				</div>

				<div className='col-12 col-md-9 px-3  my-4'>
					{loading ? (
						<Loader />
					) : (
						<div className='card border h-100'>
							<div className='card-header'>
								<h3 className='mb-0'>Order # {order._id}</h3>
							</div>
							<div className='card-body px-0'>
								<div className='row d-flex justify-content-around'>
									<div className='col-12 col-lg-7 order-details'>
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
											<b>Amount:</b> DT {totalPrice}
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
																src={item.image}
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
														</div>

														<div className='col-4 col-lg-2 mt-4 mt-lg-0'>
															<p>DT {item.price}</p>
														</div>

														<div className='col-4 col-lg-3 mt-4 mt-lg-0'>
															<p>{item.quantity} Piece(s)</p>
														</div>
													</div>
												))}
										</div>
										<hr />
									</div>

									<div className='col-12 col-lg-3'>
										<h4>Status</h4>

										<div className='form-group'>
											<select
												className='form-control'
												name='status'
												value={status === '' ? orderStatus : status}
												onChange={(e) => setStatus(e.target.value)}
											>
												<option value='Processing'>Processing</option>
												<option value='Delivered'>Delivered</option>
											</select>
										</div>

										<button
											className='btn btn-primary btn-block'
											onClick={() => updateOrderHandler(order._id)}
										>
											Update Status
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default AdminOrdersProcess

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
	const {
		shippingInfo,
		orderItems,
		user,
		totalPrice,
		orderStatus,
		itemsPrice,
		shippingPrice,
		discount,
		couponCode,
		deliveryGovernorate,
	} = order
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
		<section className='container-fluid admin-page'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-2 admin-nav-col'
				>
					<Sidebar item='orders' />
				</div>

				<div className='col-12 col-md-10 admin-content-col'>
					{loading ? (
						<Loader />
					) : (
						<div className='card  h-100' style={{border:0}}>
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
										{deliveryGovernorate && (
											<p>
												<b>Gouvernorat:</b> {deliveryGovernorate}
											</p>
										)}

										<hr />

										<h4 className='my-4'>Payment Info</h4>
										<p>
											<b>Items Price:</b> DT{' '}
											{Number(itemsPrice || 0).toFixed(2)}
										</p>
										<p>
											<b>Delivery (Livraison):</b>{' '}
											{Number(shippingPrice || 0) === 0 ? (
												<span className='text-success'>Gratuite</span>
											) : (
												`DT ${Number(shippingPrice).toFixed(2)}`
											)}
										</p>
										<p>
											<b>Coupon:</b>{' '}
											{couponCode ? (
												<span className='text-success'>
													{couponCode} (− DT {Number(discount || 0).toFixed(2)})
												</span>
											) : (
												<span className='text-muted'>Aucun code utilisé</span>
											)}
										</p>
										<p>
											<b>Total Amount:</b> DT {Number(totalPrice || 0).toFixed(2)}
										</p>

										<hr />

										<h4 className='my-4'>Order Status:</h4>
										<p
											className={
												order.orderStatus &&
													String(order.orderStatus).includes('Delivered')
													? 'text-success'
													: order.orderStatus &&
														(String(order.orderStatus).includes('Cancelled') ||
															String(order.orderStatus).includes('Returned'))
														? 'text-danger'
														: 'text-warning'
											}
										>
											<b>{orderStatus}</b>
										</p>

										<h4 className='my-4'>Order Items:</h4>

										<hr />
										<div className="cart-item my-3">
  {orderItems && (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">Image</th>
          <th className="text-center">Product Name</th>
          <th className="text-center">Price</th>
          <th className="text-center">Quantity</th>
          <th className="text-center">Teint</th>
          <th className="text-center">Color</th>
          <th className="text-center">Size</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item) => (
          <tr key={item.product}>
            <td className="text-center">
              <img
                src={item.image}
                alt={item.name}
                className="img-fluid"
                style={{ maxWidth: '65px', height: 'auto' }}
              />
            </td>
            <td className="text-center">
              <Link to={`/products/${item.product}`} className="text-muted">
                {item.name}
              </Link>
            </td>
            <td className="text-center">
              <p className="mb-0">DT {item.price}</p>
            </td>
            <td className="text-center">
              <p className="mb-0">{item.quantity} Piece(s)</p>
            </td>
            <td className="text-center">
              {item?.teint && (
                <img
                  src={item?.teint}
                  alt="Selected Image"
                  className="img-fluid"
                  style={{ maxWidth: '150px', height: 'auto' }}
                />
              )}
            </td>
            <td className="text-center">
              {item?.color && <p className="mb-0">{item.color}</p>}
            </td>
            <td className="text-center">
              {item?.size && <p className="mb-0">{item.size}</p>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
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
												<option value='Cancelled'>Cancelled</option>
												<option value='Returned'>Returned (Retour)</option>
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

import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { allOrders, deleteOrder, clearErrors } from '../../actions/orderActions'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'

const AdminOrders = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, orders } = useSelector((state) => state.allOrders)
	const { isDeleted } = useSelector((state) => state.order)

	useEffect(() => {
		dispatch(allOrders())

		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isDeleted) {
			toast.success('Order deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/orders')
			dispatch({ type: DELETE_ORDER_RESET })
		}
	}, [dispatch, error, isDeleted, navigate])

	const deleteOrderHandler = (id) => {
		dispatch(deleteOrder(id))
	}

	const setOrders = () => {
		const data = {
			columns: [
				{
					label: 'Order ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'No of Items',
					field: 'numofItems',
					sort: 'asc',
				},
				{
					label: 'Amount',
					field: 'amount',
					sort: 'asc',
				},
				{
					label: '',
					field: 'statusIcon',
					sort: 'asc',
				},
				{
					label: 'Status',
					field: 'status',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
				},
			],
			rows: [],
		}

		orders.forEach((order) => {
			data.rows.push({
				id: order._id,
				numofItems: order.orderItems.length,
				amount: `$${order.totalPrice}`,
				statusIcon:
					order.orderStatus === 'Delivered' ? (
						<i className='fa fa-check-circle text-success' aria-hidden='true'></i>
					) : (
						<i className='fa fa-times-circle text-danger' aria-hidden='true'></i>
					),
				status: `${order.orderStatus}`,
				actions: (
					<div className='d-flex text-nowrap'>
						<Link
							to={`/admin/order/${order._id}`}
							className='btn btn-primary py-1 px-2'
						>
							<i className='fa fa-eye'></i>
						</Link>
						<button
							className='btn btn-danger py-1 px-2 ml-2'
							onClick={() => deleteOrderHandler(order._id)}
						>
							<i className='fa fa-trash'></i>
						</button>
					</div>
				),
			})
		})

		return data
	}

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
					<div className='card border h-100'>
						<div className='card-header'>
							<h3 className='mb-0'>Orders</h3>
						</div>
						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setOrders()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={orders && orders.length > 10 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total: {orders && orders.length}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminOrders

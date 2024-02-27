import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import { toast } from 'react-toastify'

import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearErrors } from '../../actions/orderActions'

const ListOrders = () => {
	const dispatch = useDispatch()

	const { loading, error, orders } = useSelector((state) => state.myOrders)

	useEffect(() => {
		dispatch(myOrders())

		if (error) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}
	}, [dispatch, error])

	const setOrders = () => {
		const data = {
			columns: [
				{
					label: 'Order ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Num of Items',
					field: 'numOfItems',
					sort: 'asc',
				},
				{
					label: 'Amount',
					field: 'amount',
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
					sort: 'asc',
				},
			],
			rows: [],
		}

		orders.forEach((order) => {
			data.rows.push({
				id: order._id,
				numOfItems: order.orderItems.length,
				amount: `$${order.totalPrice.toFixed(2)}`,
				status:
					order.orderStatus && String(order.orderStatus).includes('Delivered') ? (
						<p style={{ color: 'green' }}>{order.orderStatus}</p>
					) : (
						<p style={{ color: 'red' }}>{order.orderStatus}</p>
					),
				actions: (
					<Link to={`/order/${order._id}`} className='btn btn-primary'>
						<i className='fa fa-eye'></i>
					</Link>
				),
			})
		})

		return data
	}

	return (
		<section className='container my-4'>
			<div className='card border my-4'>
				<div className='card-header'>
					<h3 className='mb-0'>My Orders</h3>
				</div>
				<div className='card-body'>
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
						/>
					)}
				</div>
			</div>
		</section>
	)
}

export default ListOrders

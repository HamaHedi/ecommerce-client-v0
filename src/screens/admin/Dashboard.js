import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

import { useDispatch, useSelector } from 'react-redux'

import { getAdminProducts } from '../../actions/productActions'
import { allOrders } from '../../actions/orderActions'
import { allUsers } from '../../actions/userActions'
import { getCategory } from '../../actions/categoryAction'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Dashboard = () => {
	const dispatch = useDispatch()

	const { products } = useSelector((state) => state.products)
	const { users } = useSelector((state) => state.allUsers)
	const { orders, totalAmount } = useSelector((state) => state.allOrders)
	const { category } = useSelector((state) => state.categorys)

	let outOfStock = 0
	products.forEach((product) => {
		if (product.stock === 0) {
			outOfStock += 1
		}
	})

	const data = {
		labels: ['Products', 'Orders', 'Out of Stock', 'Category', 'Users'],
		datasets: [
			{
				label: 'Statistics',
				data: [
					`${products && products.length}`,
					`${orders && orders.length}`,
					`${outOfStock}`,
					`${category && category.length}`,
					`${users && users.length}`,
				],
				backgroundColor: [
					'rgba(45, 206, 137, 0.5)',
					'rgba(245, 54, 92, 0.5)',
					'rgba(251, 99, 64, 0.5)',
					'rgba(255, 169, 0, 0.5)',
					'rgba(17, 205, 239, 0.5)',
				],
			},
		],
	}

	useEffect(() => {
		dispatch(getAdminProducts())
		dispatch(allOrders())
		dispatch(allUsers())
		dispatch(getCategory())
	}, [dispatch])

	return (
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='dashboard' />
				</div>
				<div className='col-12 col-md-9 px-3  my-4'>
					<div className='card text-center bg-primary text-white'>
						<div className='card-body p-2'>
							<h5 className='text-white my-0'>Total Amount</h5>
						</div>
						<div className='card-footer bg-primary text-white py-2'>
							${totalAmount && totalAmount.toFixed(2)}
						</div>
					</div>

					<div className='row'>
						<div className='col-12 col-sm-12 col-md-4 mt-3'>
							<div className='card text-center bg-success text-white h-100'>
								<div className='card-body p-3 h-100'>
									<h5 className='text-white my-0'>Products</h5>
								</div>
								<div className='card-footer bg-success text-white py-2'>
									{products && products.length}
								</div>
							</div>
						</div>

						<div className='col-12 col-sm-12 col-md-4 mt-3'>
							<div className='card text-center bg-danger text-white h-100'>
								<div className='card-body p-3 h-100'>
									<h5 className='text-white my-0'>Orders</h5>
								</div>
								<div className='card-footer bg-danger text-white py-2'>
									{orders && orders.length}
								</div>
							</div>
						</div>

						<div className='col-12 col-sm-12 col-md-4 mt-3'>
							<div className='card text-center bg-warning text-white h-100'>
								<div className='card-body p-3 h-100'>
									<h5 className='text-white my-0'>Out of Stock</h5>
								</div>
								<div className='card-footer bg-warning text-white py-2'>
									{outOfStock}
								</div>
							</div>
						</div>
					</div>

					<hr />

					<Bar data={data} />

					<hr />

					<div className='row'>
						<div className='col-12 col-sm-12 col-md-6'>
							<div
								className='card text-center text-white h-100'
								style={{ backgroundColor: '#FFA900' }}
							>
								<div className='card-body p-3 h-100'>
									<h5 className='text-white my-0'>Categories</h5>
								</div>
								<div
									className='card-footer  text-white py-2'
									style={{ backgroundColor: '#FFA900' }}
								>
									{category && category.length}
								</div>
							</div>
						</div>

						<div className='col-12 col-sm-12 col-md-6'>
							<div className='card text-center bg-info text-white h-100'>
								<div className='card-body p-3 h-100'>
									<h5 className='text-white my-0'>Users</h5>
								</div>
								<div className='card-footer bg-info text-white py-2'>
									{users && users.length}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Dashboard

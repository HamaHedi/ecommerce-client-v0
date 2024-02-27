import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({ item }) => {
	return (
		<nav>
			<div className='row'>
				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/dashboard'
						className={
							item === 'dashboard'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/dashboard.png'
								alt='dashboard'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>Dashboard</strong>
						</div>
					</Link>
				</div>

				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/admin/products'
						className={
							item === 'products'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/products.png'
								alt='products'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>Products</strong>
						</div>
					</Link>
				</div>

				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/admin/orders'
						className={
							item === 'orders'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/orders.png'
								alt='orders'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>Orders</strong>
						</div>
					</Link>
				</div>

				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/admin/reviews'
						className={
							item === 'reviews'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/reviews.png'
								alt='reviews'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>Reviews</strong>
						</div>
					</Link>
				</div>

				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/admin/category'
						className={
							item === 'category'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/category.png'
								alt='category'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>categories</strong>
						</div>
					</Link>
				</div>

				<div className='col-6 col-sm-6 col-md-12'>
					<Link
						to='/admin/users'
						className={
							item === 'users'
								? 'btn btn-block mt-3 bg-primary'
								: 'btn btn-block mt-3'
						}
					>
						<div className='text-center'>
							<img
								src='/assets/img/dashboard/users.png'
								alt='users'
								style={{ width: '60px', height: '60px' }}
							/>
						</div>
						<div className='text-center mt-2'>
							<strong className='text-white'>Users</strong>
						</div>
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Sidebar

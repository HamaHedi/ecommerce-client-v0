import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '../actions/userActions'

const Header = () => {
	const dispatch = useDispatch()

	const { user, loading } = useSelector((state) => state.auth)

	const logoutHandler = () => {
		dispatch(logout())
		toast.success('Logged out successfully.', {
			position: toast.POSITION.TOP_RIGHT,
			className: 'm-2',
		})
	}

	return (
		<nav className='navbar navbar-expand-lg navbar-defailt py-2 border-bottom'>
			<div className='container'>
				<Link to='/' className='navbar-brand'>
					{/* <img src='/assets/logo.png' alt='logo' /> */}
					<b>
						<i className='ni ni-cart small'></i> ProShop
					</b>
				</Link>
				<button
					className='navbar-toggler border'
					type='button'
					data-toggle='collapse'
					data-target='#navbar-default'
					aria-controls='navbar-default'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<i className='fa fa-bars' aria-hidden='true' style={{ color: '#A0A0A0' }}></i>
				</button>
				<div className='collapse navbar-collapse' id='navbar-default'>
					<div className='navbar-collapse-header'>
						<div className='row'>
							<div className='col-6 collapse-brand'>
								<Link to='/'>
									{/* <img src='/assets/img/brand/blue.png' alt='logo' /> */}
									<b>
										<i className='ni ni-cart small'></i> ProShop
									</b>
								</Link>
							</div>
							<div className='col-6 collapse-close'>
								<button
									type='button'
									className='navbar-toggler'
									data-toggle='collapse'
									data-target='#navbar-default'
									aria-controls='navbar-default'
									aria-expanded='false'
									aria-label='Toggle navigation'
								>
									<span></span>
									<span></span>
								</button>
							</div>
						</div>
					</div>

					<ul className='navbar-nav ml-lg-auto'>
						<li className='nav-item'>
							<Link to='/cart' className='nav-link nav-link-icon mt-3 mt-lg-0'>
								<i className='ni ni-cart'></i>
								<span className='nav-link-inner--text font-weight-bold'>Cart</span>
							</Link>
						</li>

						{user && user.name ? (
							<li className='nav-item dropdown'>
								<span
									className='nav-link nav-link-icon'
									style={{ cursor: 'pointer' }}
									id='navbar-default_dropdown_1'
									role='button'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'
								>
									<img
										src={user && `${user.avatar}`}
										alt='user'
										className='rounded-circle'
										style={{ width: '25px', height: '25px' }}
									/>
									<span className='nav-link-inner--text font-weight-bold text-nowrap'>
										&nbsp;{user && user.name}&nbsp;
										<i className='fa fa-caret-down' aria-hidden='true'></i>
									</span>
								</span>
								<div
									className='dropdown-menu dropdown-menu-right'
									aria-labelledby='navbar-default_dropdown_1'
								>
									{user && user.role === 'admin' && (
										<Link
											to='/dashboard'
											className='dropdown-item d-flex align-items-center'
										>
											<i className='fa fa-bar-chart' aria-hidden='true'></i>
											Dashboard
										</Link>
									)}

									<Link
										to='/orders'
										className='dropdown-item d-flex align-items-center'
									>
										<i className='fa fa-credit-card-alt' aria-hidden='true'></i>
										Orders
									</Link>

									<Link
										to='/profile'
										className='dropdown-item d-flex align-items-center'
									>
										<i className='fa fa-user-circle' aria-hidden='true'></i>
										Profile
									</Link>

									<Link
										to='/settings'
										className='dropdown-item d-flex align-items-center'
									>
										<i className='fa fa-cog' aria-hidden='true'></i>
										Settings
									</Link>

									<div className='dropdown-divider'></div>

									<button
										className='dropdown-item d-flex align-items-center'
										onClick={logoutHandler}
									>
										<i className='fa fa-sign-out' aria-hidden='true'></i>
										Logout
									</button>
								</div>
							</li>
						) : (
							!loading && (
								<li className='nav-item'>
									<Link to='/login' className='nav-link nav-link-icon'>
										<i className='ni ni-single-02'></i>
										<span className='nav-link-inner--text font-weight-bold'>
											Sign in
										</span>
									</Link>
								</li>
							)
						)}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Header

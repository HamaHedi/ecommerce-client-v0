import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../actions/userActions'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()

	const { isAuthenticated, error, loading } = useSelector((state) => state.auth)

	const redirect = location.search ? '/' + location.search.split('=')[1] : '/'

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(login(email, password))
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate(redirect)
		}

		if (error && error.message) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
		}
	}, [dispatch, isAuthenticated, error, navigate, redirect])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section className='container my-4'>
			<div className='container py-5 h-100'>
				<div className='row d-flex justify-content-center align-items-center h-100'>
					<div className='col-12 col-md-8 col-lg-6 col-xl-5'>
						<div className='card shadow-lg' style={{ borderRadius: '1rem' }}>
							<div className='card-body p-5 text-center'>
								<h3>
									<b>Sign in</b>
								</h3>
								<p className='mb-4'>Welcome Back 👋</p>

								<form onSubmit={submitHandler}>
									<div className='form-group mb-4'>
										<input
											type='email'
											required
											className='form-control form-control-alternative'
											placeholder='enter your email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>

									<div className='form-group'>
										<input
											type='password'
											required
											className='form-control form-control-alternative'
											placeholder='enter your password'
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{error && error.errors && error.errors.password && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.errors.password}
											</small>
										)}
									</div>

									<div className='text-right mt-1 mb-3'>
										<Link to='/forgot-password' type='submit'>
											Forgot password?
										</Link>
									</div>

									<button
										className='btn btn-primary btn-lg btn-block mb-4'
										type='submit'
										disabled={loading ? true : false}
									>
										{loading ? (
											<div
												className='spinner-border'
												role='status'
												style={{ width: '25px', height: '25px' }}
											>
												<span className='sr-only'>Loading...</span>
											</div>
										) : (
											'Login'
										)}
									</button>
								</form>

								<span>
									Not registered yet?{' '}
									<Link to='/register'>Create an Account</Link>
								</span>

								<hr className='my-4' />

								<div>
									<button
										className='btn text-white'
										style={{ backgroundColor: '#E34133' }}
										type='submit'
									>
										<i className='fa fa-google' aria-hidden='true'></i>
									</button>

									<button
										className='btn text-white'
										style={{ backgroundColor: '#4064AC' }}
										type='submit'
									>
										<i className='fa fa-facebook' aria-hidden='true'></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Login

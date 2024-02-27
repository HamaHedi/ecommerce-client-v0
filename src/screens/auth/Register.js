import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userActions'

const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [confirmPasswordError, setConfirmPasswordError] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { isAuthenticated, error, loading } = useSelector((state) => state.auth)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(clearErrors())
		setConfirmPasswordError('')

		if (password !== confirmPassword) {
			setConfirmPasswordError("Passwords don't match")
		} else {
			dispatch(register(name, email, password))
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
		}
	}, [dispatch, isAuthenticated, navigate])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section section className='container my-4'>
			<div className='container py-5 h-100'>
				<div className='row d-flex justify-content-center align-items-center h-100'>
					<div className='col-12 col-md-8 col-lg-6 col-xl-5'>
						<div className='card shadow-lg' style={{ borderRadius: '1rem' }}>
							<div className='card-body p-5 text-center'>
								<h3>
									<b>Sign up</b>
								</h3>
								<p className='mb-4'>Adventure starts here 🚀</p>

								<form onSubmit={submitHandler}>
									<div className='form-group mb-4'>
										<input
											type='text'
											required
											className='form-control form-control-alternative'
											placeholder='enter your name'
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
										{error && error.errors && error.errors.name && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.errors.name}
											</small>
										)}
									</div>

									<div className='form-group mb-4'>
										<input
											type='email'
											required
											className='form-control form-control-alternative'
											placeholder='enter your email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
										{error && error.errors && error.errors.email && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.errors.email}
											</small>
										)}
									</div>

									<div className='form-group mb-4'>
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

									<div className='form-group mb-4'>
										<input
											type='password'
											required
											className='form-control form-control-alternative'
											placeholder='Confirm your password'
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
										{confirmPasswordError && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{confirmPasswordError}
											</small>
										)}
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
											'Register'
										)}
									</button>
								</form>

								<span>
									Already have an Account? <Link to='/login'>Sign in</Link>
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

export default Register

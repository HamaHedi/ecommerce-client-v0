import React, { useState, useEffect } from 'react'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../actions/userActions'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
	const [email, setEmail] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { isAuthenticated } = useSelector((state) => state.auth)
	const { error, loading, message } = useSelector((state) => state.forgotPassword)

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(forgotPassword({ email }))
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
		}

		if (error && error.message) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (message) {
			toast.success(message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
		}
	}, [dispatch, error, isAuthenticated, message, navigate])

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : (
				<div className='card card-profile shadow-sm mt-5'>
					<div className='card-header text-center border-0'>
						<b>Forgot Password</b>
					</div>
					<div className='card-body'>
						<form onSubmit={submitHandler}>
							<div className='form-group mb-4'>
								<small className='mb-2 mx-1'>Email:</small>
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

							<div className='text-center'>
								<button
									type='submit'
									className='btn btn-primary'
									disabled={loading ? true : false}
								>
									{loading ? (
										<div
											className='spinner-border'
											role='status'
											style={{ width: '22px', height: '22px' }}
										>
											<span className='sr-only'>Loading...</span>
										</div>
									) : (
										'Submit'
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	)
}

export default ForgotPassword

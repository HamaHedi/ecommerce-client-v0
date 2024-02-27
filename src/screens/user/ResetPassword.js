import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearErrors } from '../../actions/userActions'

const ResetPassword = () => {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { token } = useParams()

	const { isAuthenticated } = useSelector((state) => state.auth)
	const { error, success } = useSelector((state) => state.forgotPassword)

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(
			resetPassword(token, {
				password,
				confirmPassword,
			})
		)
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

		if (success) {
			toast.success('Password updated successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/login')
		}
	}, [dispatch, error, success, isAuthenticated, navigate])

	return (
		<section className='container my-4'>
			<div className='card card-profile shadow-sm mt-5'>
				<div className='card-header text-center border-0'>
					<b>Reset Password</b>
				</div>
				<div className='card-body'>
					<form onSubmit={submitHandler}>
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
							{error && error.errors && error.errors.confirmPassword && (
								<small className='form-text text-danger text-left mt-2 mx-1'>
									{error.errors.confirmPassword}
								</small>
							)}
						</div>

						<div className='text-center'>
							<button type='submit' className='btn btn-primary'>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default ResetPassword

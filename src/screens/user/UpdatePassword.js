import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'

import { toast } from 'react-toastify'
import { updatePassword, clearErrors } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'

const UpdatePassword = () => {
	const [oldPassword, setOldPassword] = useState('')
	const [password, setPassword] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { error, isUpdated, loading } = useSelector((state) => state.user)

	const updatePasswordHandler = (e) => {
		e.preventDefault()

		dispatch(clearErrors())

		dispatch(updatePassword(oldPassword, password))
	}

	useEffect(() => {
		if (isUpdated) {
			toast.success('Password updated successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})

			navigate('/profile')

			dispatch({
				type: UPDATE_PASSWORD_RESET,
			})
		}
	}, [dispatch, navigate, isUpdated])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : (
				<div className='card card-profile shadow-sm mt-5'>
					<div className='card-header text-center border-0'>
						<b>Change Password</b>
					</div>
					<div className='card-body'>
						<form onSubmit={updatePasswordHandler}>
							<div className='row mt-2'>
								<div className='col-12 col-sm-12 col-md-6'>
									<div className='form-group mb-4'>
										<small className='mb-2 mx-1'>Old Password:</small>
										<input
											type='password'
											required
											className='form-control'
											placeholder='enter your old password'
											value={oldPassword}
											onChange={(e) => setOldPassword(e.target.value)}
										/>
										{error && error.errors && error.errors.password && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.errors.password}
											</small>
										)}
										{error && error.message && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.message}
											</small>
										)}
									</div>
								</div>

								<div className='col-12 col-sm-12 col-md-6'>
									<div className='form-group mb-4'>
										<small className='mb-2 mx-1'>New Password:</small>
										<input
											type='password'
											required
											className='form-control'
											placeholder='enter your new password'
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{error && error.errors && error.errors.password && (
											<small className='form-text text-danger text-left mt-2 mx-1'>
												{error.errors.password}
											</small>
										)}
									</div>
								</div>
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

export default UpdatePassword

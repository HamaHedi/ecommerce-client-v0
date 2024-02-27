import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, getUserDetails, clearErrors } from '../../actions/userActions'
import { UPDATE_USER_RESET } from '../../constants/userConstants'

const AdminUserUpdate = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { error, isUpdated } = useSelector((state) => state.user)
	const { user } = useSelector((state) => state.userDetails)

	const { id } = useParams()

	useEffect(() => {
		if (user && user._id !== id) {
			dispatch(getUserDetails(id))
		} else {
			setName(user.name)
			setEmail(user.email)
			setRole(user.role)
		}

		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isUpdated) {
			toast.success('User updated successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})

			navigate('/admin/users')

			dispatch({
				type: UPDATE_USER_RESET,
			})
		}
	}, [dispatch, error, isUpdated, user, id, navigate])

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(
			updateUser(user._id, {
				name,
				email,
				role,
			})
		)
		dispatch(getUserDetails(id))
	}

	return (
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='users' />
				</div>

				<div className='col-12 col-md-9 px-3 my-4'>
					<div className='card border h-100'>
						<div className='card-header'>
							<h3 className='mb-0'>Update User</h3>
						</div>
						<div className='card-body'>
							<form onSubmit={submitHandler}>
								<div className='form-group'>
									<label htmlFor='name_field'>Name</label>
									<input
										type='name'
										id='name_field'
										className='form-control'
										name='name'
										value={name}
										disabled
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='email_field'>Email</label>
									<input
										type='email'
										id='email_field'
										className='form-control'
										name='email'
										value={email}
										disabled
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='role_field'>Role</label>

									<select
										id='role_field'
										className='form-control'
										name='role'
										value={role}
										onChange={(e) => setRole(e.target.value)}
									>
										<option value='user'>user</option>
										<option value='admin'>admin</option>
									</select>
								</div>

								<button
									type='submit'
									className='btn btn-primary btn-block mt-4 mb-3'
								>
									Update
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminUserUpdate

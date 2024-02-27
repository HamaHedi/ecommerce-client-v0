import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { newCategory, clearErrors } from '../../actions/categoryAction'
import { NEW_CATEGORY_RESET } from '../../constants/categoryConstants'

const AdminCategoryAdd = () => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, success } = useSelector((state) => state.newCategory)

	useEffect(() => {
		if (error && error.message) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (success) {
			navigate('/admin/category')
			toast.success('Category created successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch({ type: NEW_CATEGORY_RESET })
		}
	}, [dispatch, error, success, navigate])

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(
			newCategory({
				title,
				description,
			})
		)
	}

	return (
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='category' />
				</div>

				<div className='col-12 col-md-9 px-3 my-4'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between'>
							<h3 className='mb-0'>New Category</h3>
						</div>
						<div className='card-body'>
							<form onSubmit={submitHandler}>
								<div className='form-group'>
									<label htmlFor='name_field'>
										Title <small>*</small>
									</label>
									<input
										type='text'
										id='name_field'
										placeholder='Title'
										className='form-control'
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
									{error && error.errors && error.errors.title && (
										<small className='form-text text-danger text-left mt-2 mx-1'>
											{error.errors.title}
										</small>
									)}
								</div>

								<div className='form-group'>
									<label htmlFor='description_field'>Description</label>
									<textarea
										className='form-control'
										id='description_field'
										rows='8'
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>

								<button
									id='login_button'
									type='submit'
									className='btn btn-primary btn-block mt-4'
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
										'CREATE'
									)}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminCategoryAdd

import React, { useState, useEffect } from 'react'
import { MDBDataTable } from 'mdbreact'
import { useNavigate } from 'react-router-dom'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getProductReviews, deleteReview, clearErrors } from '../../actions/productActions'
import { DELETE_REVIEW_RESET } from '../../constants/productConstants'

const AdminReviews = () => {
	const [prodId, setProdId] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, reviews } = useSelector((state) => state.productReviews)
	const { isDeleted, error: deleteError } = useSelector((state) => state.review)

	useEffect(() => {
		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (deleteError) {
			toast.error(deleteError, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isDeleted) {
			toast.success('Review deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch({ type: DELETE_REVIEW_RESET })
			dispatch(getProductReviews(prodId))
		}
	}, [dispatch, error, isDeleted, deleteError, navigate, prodId])

	const deleteReviewHandler = (id) => {
		dispatch(deleteReview(id, prodId))
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(getProductReviews(prodId))
	}

	const setReviews = () => {
		const data = {
			columns: [
				{
					label: 'Review ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Rating',
					field: 'rating',
					sort: 'asc',
				},
				{
					label: 'Comment',
					field: 'comment',
					sort: 'asc',
				},
				{
					label: 'User',
					field: 'user',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
				},
			],
			rows: [],
		}

		reviews.forEach((review) => {
			data.rows.push({
				id: review._id,
				rating: review.rating,
				comment: review.comment,
				user: review.name,

				actions: (
					<button
						className='btn btn-danger py-1 px-2 ml-2'
						onClick={() => deleteReviewHandler(review._id)}
					>
						<i className='fa fa-trash'></i>
					</button>
				),
			})
		})

		return data
	}

	return (
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='reviews' />
				</div>

				<div className='col-12 col-md-9 px-3  my-4'>
					<div className='card border h-100'>
						<div className='card-header'>
							<h3 className='mb-0'>Reviews</h3>
						</div>
						<div className='card-body px-0'>
							<form onSubmit={submitHandler} className='mx-4'>
								<div className='form-group'>
									<label htmlFor='productId_field'>Enter Product ID</label>
									<input
										type='text'
										required
										id='productId_field'
										className='form-control'
										value={prodId}
										onChange={(e) => setProdId(e.target.value)}
									/>
								</div>

								<button
									id='search_button'
									type='submit'
									className='btn btn-primary btn-block py-2'
								>
									SEARCH
								</button>
							</form>

							<hr className='mb-3' />

							{loading ? (
								<Loader />
							) : reviews && reviews.length > 0 ? (
								<MDBDataTable
									data={setReviews()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={reviews && reviews.length > 10 ? true : false}
								/>
							) : (
								<p className='text-center'>No Reviews.</p>
							)}
						</div>
						<div className='card-footer'>Total: {reviews && reviews.length}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminReviews

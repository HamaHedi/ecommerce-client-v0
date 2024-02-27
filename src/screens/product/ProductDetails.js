import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, newReview, clearErrors } from '../../actions/productActions'
import { addItemToCart } from '../../actions/cartActions'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Slider from '../../components/Slider'
import { toast } from 'react-toastify'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'
import ReactStars from 'react-rating-stars-component'
import Swal from 'sweetalert2'
import ListReviews from '../../components/ListReviews'

const ProductDetails = () => {
	const [quantity, setQuantity] = useState(1)
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')

	const dispatch = useDispatch()

	const { id } = useParams()

	const { loading, error, product } = useSelector((state) => state.productDetails)
	const { user } = useSelector((state) => state.auth)
	const { error: reviewError, success } = useSelector((state) => state.newReview)

	const decreaseQty = () => {
		const count = document.querySelector('.count')

		if (count.valueAsNumber <= 1) return

		const qty = count.valueAsNumber - 1
		setQuantity(qty)
	}

	const increaseQty = () => {
		const count = document.querySelector('.count')

		if (count.valueAsNumber >= product.stock) return

		const qty = count.valueAsNumber + 1
		setQuantity(qty)
	}

	const addToCart = () => {
		dispatch(addItemToCart(id, quantity))

		toast.success('Item Added to Cart.', {
			position: toast.POSITION.TOP_RIGHT,
			className: 'm-2',
		})
	}

	const submitHandler = (e) => {
		e.preventDefault()

		if (rating === 0 || comment === '') {
			Swal.fire({
				title: 'Error!',
				text: 'Rating and Comment are Required!',
				icon: 'error',
				confirmButtonText: 'Ok',
			})
		} else {
			dispatch(
				newReview({
					rating,
					comment,
					productId: id,
				})
			)
			setComment('')
		}
	}

	useEffect(() => {
		dispatch(getProductDetails(id))

		if (reviewError) {
			toast.error(reviewError, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (success) {
			toast.success('Reivew posted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch({ type: NEW_REVIEW_RESET })
		}
	}, [dispatch, id, reviewError, success])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : error ? (
				<Message color='danger' message={error} />
			) : (
				<>
					<div className='row d-flex justify-content-around'>
						<div className='col-12 col-lg-5 img-fluid mt-4'>
							<Slider images={product.images} />
						</div>

						<div className='col-12 col-lg-5 mt-4'>
							<h3>{product.name}</h3>
							<p>Product #{product._id}</p>

							<hr />

							<div className='d-flex align-items-end'>
								<h4 className='mb-0'>
									${product.price && product.price.toFixed(2)}
								</h4>
								&nbsp;
								{product.oldPrice !== 0 && (
									<h6 className='mb-0 text-muted'>
										<del>${product.oldPrice}</del>
									</h6>
								)}
							</div>

							<hr />

							<div className='ratings mt-auto text-nowrap'>
								<div className='rating-outer'>
									<div
										className='rating-inner'
										style={{ width: `${(product.ratings / 5) * 100}%` }}
									></div>
								</div>
								<small id='no_of_reviews'>
									&nbsp;({product.numOfReviews} Reviews)
								</small>
							</div>

							<hr />

							<b>
								Status:&nbsp;
								<span
									className={product.stock > 0 ? 'text-success' : 'text-danger'}
								>
									{product.stock > 0 ? 'In Stock' : 'Out of Stock'}
								</span>
							</b>

							<hr />

							<h4>Description:</h4>
							<p>{product.description}</p>

							<hr />

							<div className='row'>
								<div className='col'>
									<div className='input-group'>
										<div className='input-group-prepend'>
											<button
												className='btn btn-sm btn-outline-danger px-3'
												type='button'
												disabled={product.stock === 0}
												onClick={decreaseQty}
											>
												<i className='fa fa-minus' aria-hidden='true'></i>
											</button>
										</div>

										<input
											type='number'
											className='form-control form-control-sm text-center count'
											value={quantity}
											readOnly
										/>

										<div className='input-group-prepend'>
											<button
												className='btn btn-sm btn-outline-success px-3'
												type='button'
												disabled={product.stock === 0}
												onClick={increaseQty}
											>
												<i className='fa fa-plus' aria-hidden='true'></i>
											</button>
										</div>
									</div>
								</div>

								<div className='col'>
									<button
										type='button'
										className='btn btn-sm text-white w-100 h-100 text-nowrap'
										style={{ backgroundColor: '#FF9D1C' }}
										disabled={product.stock === 0}
										onClick={addToCart}
									>
										<i className='fa fa-shopping-cart' aria-hidden='true'></i>
										&nbsp;&nbsp;Add to Cart
									</button>
								</div>
							</div>

							<hr />

							<p>
								Sold by: <strong>{product.seller}</strong>
							</p>
						</div>
					</div>

					<hr />

					<div className='row d-flex justify-content-center'>
						<div className='col-md-12'>
							<div
								className='card shadow-0 border'
								style={{ backgroundColor: '#F6F9FC' }}
							>
								<div className='card-body p-4'>
									{user ? (
										<form onSubmit={submitHandler}>
											<h5 className='text-center'>WRITE A REVIEW</h5>

											<div className='star-container text-center text-nowrap mb-3'>
												<div
													className='star-widget text-nowrap'
													style={{ display: 'inline-block' }}
												>
													<ReactStars
														count={5}
														onChange={setRating}
														size={32}
														isHalf={false}
														emptyIcon={<i className='far fa-star'></i>}
														fullIcon={<i className='fa fa-star'></i>}
														activeColor='#ffd700'
														value={rating}
													/>
												</div>
											</div>

											<div className='form-group'>
												<textarea
													className='form-control'
													placeholder='Describe your experience.'
													style={{ minHeight: '100px' }}
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												></textarea>
											</div>

											<div className='text-center mt-4'>
												<button
													type='submit'
													className='btn py-2 text-white text-nowrap'
													style={{
														backgroundColor: '#FF9D1C',
														borderRadius: '25px',
													}}
												>
													Submit
												</button>
											</div>
										</form>
									) : (
										<Message
											color='warning'
											message='Login to post your review.'
										/>
									)}

									<hr />

									{product && product.reviews && product.reviews.length > 0 ? (
										<ListReviews reviews={product.reviews} />
									) : (
										<h6 className='text-center'>No Reviews found!</h6>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</section>
	)
}

export default ProductDetails

import React, { useEffect, useState, useRef } from 'react'
import Product from '../../components/Product'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, clearErrors } from '../../actions/productActions'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Banner from '../../components/Banner'
import { getCategory } from '../../actions/categoryAction'
import Pagination from 'react-js-pagination'

const Products = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [price, setPrice] = useState([1, 1000])
	const [category, setCategory] = useState('')
	const [rating, setRating] = useState(0)
	const [keyword, setKeyword] = useState('')

	const keywordRef = useRef('')
	const minPriceRef = useRef(0)
	const maxPriceRef = useRef(1000)

	const dispatch = useDispatch()

	const { loading, products, error, productsCount, resPerPage, filteredProductsCount } =
		useSelector((state) => state.products)

	const { loading: categoryLoading, category: allCategory } = useSelector(
		(state) => state.categorys
	)

	const submitHandler = (e) => {
		e.preventDefault()
		setPrice([minPriceRef.current.value, maxPriceRef.current.value])
	}

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber)
	}

	let count = productsCount
	if (keyword) {
		count = filteredProductsCount
	}

	const searchHandler = (e) => {
		e.preventDefault()
		setCurrentPage(1)
		setPrice([1, 1000])
		setCategory('')
		setRating(0)
		setKeyword(keywordRef.current.value)
	}

	useEffect(() => {
		dispatch(getCategory())
		dispatch(getProducts(keyword, currentPage, price, category, rating))
	}, [dispatch, keyword, category, currentPage, price, rating])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section className={`${keyword ? 'container my-4' : ''}`}>
			<div className='row'>
				{keyword && (
					<div className='col-12 col-md-3'>
						<div className='p-2 h-100'>
							<form onSubmit={submitHandler}>
								<h6>
									<b>Price Range: {price}</b>
								</h6>

								<div className='row mt-3 mb-2'>
									<div className='col'>
										<div className='form-group'>
											<small>Min</small>
											<input
												type='number'
												min={0}
												max={1000}
												className='form-control form-control-sm text-center'
												placeholder='Min'
												defaultValue={0}
												required
												ref={minPriceRef}
											/>
										</div>
									</div>
									<div className='col'>
										<div className='form-group'>
											<small>Max</small>
											<input
												type='number'
												min={0}
												max={1000}
												className='form-control form-control-sm text-center'
												placeholder='Max'
												defaultValue={1000}
												required
												ref={maxPriceRef}
											/>
										</div>
									</div>
								</div>

								<div className='text-center'>
									<button type='submit' className='btnS btn-sm btn-success'>
										Search
									</button>
								</div>
							</form>

							<hr />

							<h6>
								<b>Categories:</b>
							</h6>

							<ul className='list-group'>
								<li className='list-group-item p-2'>
									<b
										onClick={() => setCategory('')}
										style={{ cursor: 'pointer' }}
									>
										All
									</b>
								</li>

								{categoryLoading ? (
									<div className='text-center my-3'>
										<div className='spinner-border' role='status'>
											<span className='sr-only'>Loading...</span>
										</div>
									</div>
								) : (
									allCategory &&
									allCategory.map((category) => (
										<li className='list-group-item p-2' key={category._id}>
											<small
												onClick={() => setCategory(category.title)}
												style={{ cursor: 'pointer' }}
											>
												{category.title}
											</small>
										</li>
									))
								)}
							</ul>

							<hr />

							<h6>
								<b>Ratings:</b>
							</h6>

							<ul className='pl-0'>
								{[5, 4, 3, 2, 1, 0].map((star) => (
									<li
										style={{
											cursor: 'pointer',
											listStyleType: 'none',
										}}
										key={star}
										onClick={() => setRating(star)}
									>
										<div className='rating-outer'>
											<div
												className='rating-inner'
												style={{
													width: `${star * 20}%`,
												}}
											></div>
										</div>
										<small id='no_of_reviews'>&nbsp;{star}/5</small>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				<div className={keyword ? 'col-12 col-md-9' : 'col'}>
					{!keyword && <Banner />}

					<section className='container my-4'>
						<form onSubmit={searchHandler}>
							<div className='input-group mb-4'>
								<input
									type='text'
									className='form-control'
									placeholder='Search...'
									ref={keywordRef}
								/>
								<div className='input-group-append'>
									<span className='input-group-text' id='basic-addon2'>
										<i className='fa fa-search' aria-hidden='true'></i>
									</span>
								</div>
							</div>
						</form>

						{loading ? (
							<Loader />
						) : products && products.length === 0 ? (
							<Message color='danger' message={'No Results Found!'} />
						) : error ? (
							<Message color='danger' message={error} />
						) : (
							<>
								<div className='row'>
									{products &&
										products.map((product) => (
											<Product key={product._id} product={product} />
										))}
								</div>

								{resPerPage < count && (
									<div className='d-flex justify-content-center'>
										<Pagination
											activePage={currentPage}
											itemsCountPerPage={resPerPage}
											totalItemsCount={productsCount}
											onChange={setCurrentPageNo}
											nextPageText={'›'}
											prevPageText={'‹'}
											firstPageText={'«'}
											lastPageText={'»'}
											itemClass='page-item'
											linkClass='page-link'
										/>
									</div>
								)}
							</>
						)}
					</section>
				</div>
			</div>
		</section>
	)
}

export default Products

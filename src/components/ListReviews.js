import React from 'react'

const ListReviews = ({ reviews }) => {
	return (
		<>
			{reviews &&
				reviews.map((review) => (
					<div key={review._id} className='card mb-4'>
						<div className='card-header bg-white'>
							<div className='d-flex justify-content-between'>
								<div className='d-flex'>
									<img src={review.avatar} alt='avatar' width='25' height='25' />
									&nbsp;&nbsp;
									<h6 className='mb-0'>{review.name}</h6>
								</div>

								<div className='ratings mt-auto text-nowrap'>
									<div className='rating-outer'>
										<div
											className='rating-inner'
											style={{
												width: `${(review.rating / 5) * 100}%`,
											}}
										></div>
									</div>
									<small id='no_of_reviews'>&nbsp;({review.rating}/5)</small>
								</div>
							</div>
						</div>
						<div className='card-body'>
							<p className='mb-0'>{review.comment}</p>
						</div>
					</div>
				))}
		</>
	)
}

export default ListReviews

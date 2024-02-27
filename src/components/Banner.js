import React from 'react'

const Banner = () => {
	return (
		<div className='mb-5' style={{ backgroundColor: '#E0F2FE' }}>
			<div className='container pb-5'>
				<div
					className='card border-0'
					style={{ backgroundColor: '#E0F2FE', minHeight: '400px', maxHeight: '650px' }}
				>
					<div className='card-body'>
						<div className='row'>
							<div className='col-12 col-sm-12 col-md-6 pt-4'>
								<h5 className='text-muted mb-0'>HURRY UP!</h5>
								<h1>Let's find your fashion outfit.</h1>
								<p>
									Lorem Ipsum is simply dummy text of the printing and typesetting
									industry. Lorem Ipsum has bebn the industry.
								</p>

								<button
									type='button'
									className='btn btn-outline-info mt-1'
									style={{ borderRadius: '20px' }}
								>
									SHOP NOW
								</button>
							</div>
							<div className='col-12 col-sm-12 col-md-6 pt-4'>
								<img src='/assets/img/banner.svg' alt='banner' className='w-100' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Banner

import React, { Fragment, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'
import { useTranslation } from 'react-i18next'

const Shipping = () => {
	const { shippingInfo } = useSelector((state) => state.cart)
	const { t } = useTranslation('cart')

	const [address, setAddress] = useState(shippingInfo.address)
	const [city, setCity] = useState(shippingInfo.city)
	const [postalCode, setPostalCode] = useState(shippingInfo.postalCode)
	const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country: 'Tunisia' }))
		navigate('/confirm')
	}

	return (
		<section className='container my-4'>
			<CheckoutSteps shipping />

			<div className='container py-5 h-100'>
				<div className='row d-flex justify-content-center align-items-center h-100'>
					<div className='col-12 col-md-8 col-lg-6 col-xl-5'>
						<div className='card shadow-lg' style={{ borderRadius: '1rem' }}>
							<div className='card-body p-5'>
								<form onSubmit={submitHandler}>
									<h1 className='mb-4'>{t("Shipping Info")}</h1>
									<div className='form-group'>
										<label htmlFor='address_field'>{t("Address")}</label>
										<input
											type='text'
											id='address_field'
											className='form-control'
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											required
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='city_field'>{t("City")}</label>
										<input
											type='text'
											id='city_field'
											className='form-control'
											value={city}
											onChange={(e) => setCity(e.target.value)}
											required
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='phone_field'>{t("Phone No")}</label>
										<input
											type='phone'
											id='phone_field'
											className='form-control'
											value={phoneNo}
											onChange={(e) => setPhoneNo(e.target.value)}
											required
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='postal_code_field'>{t("Postal Code")}</label>
										<input
											type='number'
											id='postal_code_field'
											className='form-control'
											value={postalCode}
											onChange={(e) => setPostalCode(e.target.value)}
											required
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='country_field'>{t("Country")}</label>
										<input
											type='text'
											id='country_field'
											className='form-control'
											value={'Tunisia'}
											required
											disabled
										/>
									</div>

									<button
										id='shipping_btn'
										type='submit'
										className='btn btn-block py-3 text-white mt-4'
										style={{ backgroundColor: '#FF9D1C' }}
									>
										{t("CONTINUE")}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Shipping

import React, { Fragment, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'
import { useTranslation } from 'react-i18next'
import { API_BASE, authHeaders } from '../../config'
import { toast } from 'react-toastify'

const Shipping = () => {
	const { shippingInfo } = useSelector((state) => state.cart)
	const { user } = useSelector((state) => state.auth)
	const { t } = useTranslation('cart')

	const [address, setAddress] = useState(shippingInfo.address)
	const [city, setCity] = useState(shippingInfo.city)
	const [postalCode, setPostalCode] = useState(shippingInfo.postalCode)
	const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
	const [savedAddresses, setSavedAddresses] = useState([])
	const [saveThis, setSaveThis] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const loadAddresses = () => {
		axios
			.get(`${API_BASE}/api/me/addresses`, authHeaders())
			.then(({ data }) => setSavedAddresses(data.addresses || []))
			.catch(() => {})
	}

	useEffect(() => {
		if (user) loadAddresses()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const fillAddress = (a) => {
		setAddress(a.address || '')
		setCity(a.city || '')
		setPostalCode(a.postalCode || '')
		setPhoneNo(a.phoneNo || '')
	}

	const deleteAddress = async (id) => {
		try {
			await axios.delete(`${API_BASE}/api/me/addresses/${id}`, authHeaders())
			setSavedAddresses((list) => list.filter((a) => a._id !== id))
		} catch (e) {
			toast.error('Suppression échouée')
		}
	}

	const submitHandler = async (e) => {
		e.preventDefault()

		dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country: 'Tunisia' }))

		if (saveThis && user) {
			try {
				await axios.post(
					`${API_BASE}/api/me/addresses`,
					{ address, city, postalCode, phoneNo },
					authHeaders()
				)
			} catch (err) {
				/* non-blocking */
			}
		}

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
									<h1 className='mb-4' style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem' }}>{t("Shipping Info")}</h1>

									{savedAddresses.length > 0 && (
										<div className='saved-addresses'>
											<label>Adresses enregistrées</label>
											{savedAddresses.map((a) => (
												<div className='saved-address' key={a._id}>
													<button type='button' className='saved-address-use' onClick={() => fillAddress(a)}><i className='fa fa-map-marker'></i><span>{a.address}{a.city ? `, ${a.city}` : ''}</span></button>
													<button type='button' className='saved-address-del' onClick={() => deleteAddress(a._id)} aria-label='Supprimer'><i className='fa fa-trash'></i></button>
												</div>
											))}
										</div>
									)}
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

									{user && (
										<label className='save-address-check'>
											<input type='checkbox' checked={saveThis} onChange={(e) => setSaveThis(e.target.checked)} /> Enregistrer cette adresse
										</label>
									)}
									<button
										id='shipping_btn'
										type='submit'
										className='btn btn-block mt-4 cart-checkout-btn'
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

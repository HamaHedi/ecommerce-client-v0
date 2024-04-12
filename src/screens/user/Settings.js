import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'

import { toast } from 'react-toastify'
import { updateProfile, loadUser, clearErrors } from '../../actions/userActions'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'

const Settings = () => {
	const { t } = useTranslation('user')

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [about, setAbout] = useState('')
	const [avatar, setAvatar] = useState({})
	const [avatarPreview, setAvatarPreview] = useState('/users/default-user.png')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { user } = useSelector((state) => state.auth)
	const { error, isUpdated, loading } = useSelector((state) => state.user)

	const submitHandler = (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('name', name)
		formData.append('email', email)
		formData.append('about', about)
		formData.append('file', avatar)

		dispatch(updateProfile(formData))
	}

	const onChange = (e) => {
		const reader = new FileReader()

		reader.onload = () => {
			if (reader.readyState === 2) {
				setAvatarPreview(reader.result)
				setAvatar(e.target.files[0])
			}
		}

		reader.readAsDataURL(e.target.files[0])
	}

	const resetFile = () => {
		setAvatarPreview(user.avatar)
		setAvatar({})
	}

	useEffect(() => {
		if (user) {
			setName(user.name || '')
			setEmail(user.email || '')
			setAbout(user.about || '')
			setAvatarPreview('https://api.lagha.shop' + user.avatar || '')
		}

		if (error && error.message) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isUpdated) {
			toast.success(t("Profile info updated successfully"), {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})

			dispatch(loadUser())

			navigate('/profile')

			dispatch({
				type: UPDATE_PROFILE_RESET,
			})
		}
	}, [dispatch, error, isUpdated, navigate, user])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : (
				<div className='card card-profile shadow-sm'>
					<div className='card-header text-center border-0'>
						<b>{t("settings")}</b>
					</div>
					<div className='card-body'>
						<form encType='multipart/form-data' onSubmit={submitHandler}>
							<div className='text-center mb-4'>
								<img
									src={avatarPreview}
									alt={name}
									style={{ borderRadius: '50px', width: '250px' }}
								/>
							</div>

							<div className='text-center'>
								<label
									className='btn btn-sm btn-dark'
									htmlFor='myNewImage'
									style={{ cursor: 'pointer' }}
								>
									{t("Choose File")}
								</label>
								<label
									className='btn btn-sm btn-dark'
									onClick={resetFile}
									style={{ cursor: 'pointer' }}
								>
									{t("Reset")}
								</label>
							</div>

							<div className='row mt-4'>
								<div className='col-12 col-sm-12 col-md-6'>
									<div className='form-group mb-4'>
										<small className='mb-2 mx-1'>{t("Name")}</small>
										<input
											type='text'
											required
											className='form-control'
											placeholder={t("enter your name")}
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
								</div>

								<div className='col-12 col-sm-12 col-md-6'>
									<div className='form-group mb-4'>
										<small className='mb-2 mx-1'>{t("email")}</small>
										<input
											type='email'
											required
											className='form-control'
											placeholder={t("enter your email")}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
								</div>
							</div>

							<div className='form-group mb-4 d-none'>
								<small className='mb-2 mx-1'>{t("Image")}</small>
								<input
									type='file'
									id='myNewImage'
									className='form-control-file'
									accept='image/*'
									onChange={onChange}
								/>
							</div>

							<div className='form-group mb-4'>
								<small className='mb-2 mx-1'>{t("About")}</small>
								<textarea
									className='form-control'
									style={{ minHeight: '100px' }}
									value={about}
									onChange={(e) => setAbout(e.target.value)}
								></textarea>
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
											<span className='sr-only'>{t("Loading")}</span>
										</div>
									) : (
										t("Submit")
									)}
								</button>
							</div>
						</form>
					</div>
					<div className='card-footer text-center'>
						Joined On - {String(user && user.createdAt).substring(0, 10)}
					</div>
				</div>
			)}
		</section>
	)
}

export default Settings

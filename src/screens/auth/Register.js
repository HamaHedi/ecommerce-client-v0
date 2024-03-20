import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userActions'
import "../../styles/register.css"
const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [confirmPasswordError, setConfirmPasswordError] = useState('')
	const { t } = useTranslation('auth')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { isAuthenticated, error, loading } = useSelector((state) => state.auth)

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(clearErrors())
		setConfirmPasswordError('')

		if (password !== confirmPassword) {
			setConfirmPasswordError("Passwords don't match")
		} else {
			dispatch(register(name, email, password))
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
		}
	}, [dispatch, isAuthenticated, navigate])

	useEffect(() => {
		dispatch(clearErrors())
	}, [dispatch])

	return (
		<>
			<div className='background-image-container'>
				<span className='login-title'>{t("CREATE_ACCOUNT")}</span>
				<span className='login-subtitle'>{t("home")} / {t("Create_Account")}</span>
			</div>
			<section section className='container my-4'>
				<div className='container py-5 h-100'>
					<div className='row d-flex justify-content-center align-items-center h-100'>
						<div className='col-12 col-md-8 col-lg-6 col-xl-5'>
							<div >
								<div className='card-body p-5 text-center'>


									<form onSubmit={submitHandler}>
										<div className='form-group mb-4'>
											<input
												type='text'
												required
												className='login-input'
												placeholder={t("enter_your_name")}
												value={name}
												onChange={(e) => setName(e.target.value)}
											/>
											{error && error.errors && error.errors.name && (
												<small className='form-text text-danger text-left mt-2 mx-1'>
													{error.errors.name}
												</small>
											)}
										</div>

										<div className='form-group mb-4'>
											<input
												type='email'
												required
												className='login-input'
												placeholder={t("enter_your_email")}
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											{error && error.errors && error.errors.email && (
												<small className='form-text text-danger text-left mt-2 mx-1'>
													{error.errors.email}
												</small>
											)}
										</div>

										<div className='form-group mb-4'>
											<input
												type='password'
												required
												className='login-input'
												placeholder={t("enter_your_password")}
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											{error && error.errors && error.errors.password && (
												<small className='form-text text-danger text-left mt-2 mx-1'>
													{error.errors.password}
												</small>
											)}
										</div>

										<div className='form-group mb-4'>
											<input
												type='password'
												required
												className='login-input'
												placeholder={t("confirm_your_password")}
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
											/>
											{confirmPasswordError && (
												<small className='form-text text-danger text-left mt-2 mx-1'>
													{confirmPasswordError}
												</small>
											)}
										</div>

										<button
											className='login-button'
											type='submit'
											disabled={loading ? true : false}
										>
											{loading ? (
												<div
													className='spinner-border'
													role='status'
													style={{ width: '25px', height: '25px' }}
												>
													<span className='sr-only'>{t("loading")}</span>
												</div>
											) : (
												t("register")
											)}
										</button>
									</form>

									<span>
										{t("already_have_an_account")
										} <Link to='/login' className='login-link'>	{t("sign_in")
										}</Link>
									</span>



								</div>
							</div>
						</div>
					</div>
				</div>
			</section></>
	)
}

export default Register

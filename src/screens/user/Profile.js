import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'
import '../../styles/profile.css'

const Profile = () => {
	const { user, loading } = useSelector((state) => state.auth)
	const { t } = useTranslation('user')

	if (loading || !user) {
		return (
			<section className='container my-4'>
				<Loader />
			</section>
		)
	}

	return (
		<section className='profile-page'>
			<div className='profile-card'>
				<div className='profile-hero'>
					<div className='profile-avatar-wrap'>
						<img
							className='profile-avatar'
							src={'https://api.lagha.shop' + user.avatar}
							alt={user.name}
						/>
					</div>
				</div>

				<div className='profile-body'>
					<h1 className='profile-name'>{user.name}</h1>
					<span className='profile-role'>{user.role}</span>

					<div className='profile-details'>
						<div className='profile-detail'>
							<span className='profile-detail-icon'>
								<i className='fa fa-envelope' aria-hidden='true'></i>
							</span>
							<span className='profile-detail-text'>
								<span className='profile-detail-label'>{t('Email') !== 'Email' ? t('Email') : 'Email'}</span>
								<span className='profile-detail-value'>{user.email}</span>
							</span>
						</div>

						<div className='profile-detail'>
							<span className='profile-detail-icon'>
								<i className='fa fa-phone' aria-hidden='true'></i>
							</span>
							<span className='profile-detail-text'>
								<span className='profile-detail-label'>{t('Phone') !== 'Phone' ? t('Phone') : 'Téléphone'}</span>
								<span className='profile-detail-value'>
									{user.phoneNo || '—'}
								</span>
							</span>
						</div>

						<div className='profile-detail'>
							<span className='profile-detail-icon'>
								<i className='fa fa-calendar' aria-hidden='true'></i>
							</span>
							<span className='profile-detail-text'>
								<span className='profile-detail-label'>{t('Joined On')}</span>
								<span className='profile-detail-value'>
									{String(user.createdAt).substring(0, 10)}
								</span>
							</span>
						</div>

						<div className='profile-detail'>
							<span className='profile-detail-icon'>
								<i className='fa fa-id-badge' aria-hidden='true'></i>
							</span>
							<span className='profile-detail-text'>
								<span className='profile-detail-label'>{t('Account') !== 'Account' ? t('Account') : 'Compte'}</span>
								<span className='profile-detail-value'>{user.role}</span>
							</span>
						</div>
					</div>

					<div className='profile-actions'>
						<Link to='/settings' className='profile-btn profile-btn-primary'>
							<i className='fa fa-user-circle' aria-hidden='true'></i>
							{t('Update Profile')}
						</Link>
						<Link to='/password-update' className='profile-btn profile-btn-outline'>
							<i className='fa fa-lock' aria-hidden='true'></i>
							{t('Update Password')}
						</Link>
						<Link to='/orders' className='profile-btn profile-btn-outline'>
							<i className='fa fa-shopping-bag' aria-hidden='true'></i>
							{t('My Orders') !== 'My Orders' ? t('My Orders') : 'Mes commandes'}
						</Link>
					</div>

					{user.about && <p className='profile-about'>{user.about}</p>}
				</div>
			</div>
		</section>
	)
}

export default Profile

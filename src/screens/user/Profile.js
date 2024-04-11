import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'

const Profile = () => {
	const { user, loading } = useSelector((state) => state.auth)
	const { t } = useTranslation('user')

	return (
		<section className='container my-4'>
			{loading ? (
				<Loader />
			) : (
				<div className='card card-profile shadow-sm'>
					<div className='card-header text-center border-0'>
						<b>{t("my_profile")}</b>
					</div>
					<div className='card-body'>
						<div className='text-center'>
							<img
								src={user && user.avatar}
								alt={user && user.name}
								style={{ borderRadius: '50px', width: '250px' }}
							/>
						</div>

						<div className='text-center mt-4'>
							<h5>{user && user.name}</h5>
							<div className='h6 font-weight-300'>{user && user.role}</div>
							<div className='h6 mt-4'>{user && user.email}</div>
							<div>{t("Joined On")} - {String(user && user.createdAt).substring(0, 10)}</div>
						</div>

						<div className='text-center mt-4'>
							<Link to='/settings' className='btn btn-sm btn-info'>
							{t("Update Profile")}
							</Link>
						</div>
						<div className='text-center mt-4'>
							<Link to='/password-update' className='btn btn-sm btn-warning'>
							{t("Update Password")}
							</Link>
						</div>
					</div>
					{user && user.about && (
						<div className='card-footer text-center'>{user.about}</div>
					)}
				</div>
			)}
		</section>
	)
}

export default Profile

import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/admin.css'

const NAV = [
	{ key: 'dashboard', to: '/dashboard', icon: 'fa-tachometer', label: 'dashboard' },
	{ key: 'products', to: '/admin/products', icon: 'fa-cubes', label: 'products' },
	{ key: 'orders', to: '/admin/orders', icon: 'fa-shopping-cart', label: 'orders' },
	{ key: 'category', to: '/admin/category', icon: 'fa-tags', label: 'categories' },
	{ key: 'brand', to: '/admin/brand', icon: 'fa-bookmark', label: 'brand' },
	{ key: 'coupons', to: '/admin/coupons', icon: 'fa-ticket', label: 'coupons' },
	{ key: 'banners', to: '/admin/banners', icon: 'fa-picture-o', label: 'banners' },
	{ key: 'reviews', to: '/admin/reviews', icon: 'fa-star', label: 'reviews' },
	{ key: 'users', to: '/admin/users', icon: 'fa-users', label: 'users' },
]

const Sidebar = ({ item }) => {
	const { t } = useTranslation('sidebar')

	return (
		<nav className='admin-sidebar'>
			<Link to='/' className='admin-sidebar-brand'>
				<img src='/assets/new-logo-2.png' alt='lagha shop' />
				<span>

					<small>Espace Admin</small>
				</span>
			</Link>

			<div className='admin-sidebar-section'>Gestion</div>
			<ul className='admin-nav-list'>
				{NAV.map((n) => (
					<li key={n.key}>
						<Link
							to={n.to}
							className={`admin-nav-link ${item === n.key ? 'active' : ''}`}
						>
							<i className={`fa ${n.icon}`} aria-hidden='true'></i>
							<span>{t(n.label)}</span>
						</Link>
					</li>
				))}
			</ul>

			<Link to='/' className='admin-nav-link admin-nav-back'>
				<i className='fa fa-arrow-left' aria-hidden='true'></i>
				<span>{t('store') !== 'store' ? t('store') : 'Retour boutique'}</span>
			</Link>
		</nav>
	)
}

export default Sidebar

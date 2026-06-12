import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import Footer from './components/Footer'
import Products from './screens/product/Products'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Cart from './screens/cart/Cart'
import ProductDetails from './screens/product/ProductDetails'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import IsAuthenticatedRoutes from './routes/IsAuthenticatedRoutes'
import IsAdminRoutes from './routes/IsAdminRoutes'
import { loadUser } from './actions/userActions'
import store from './store'
import Profile from './screens/user/Profile'
import Settings from './screens/user/Settings'
import UpdatePassword from './screens/user/UpdatePassword'
import ForgotPassword from './screens/user/ForgotPassword'
import ResetPassword from './screens/user/ResetPassword'
import Shipping from './screens/cart/Shipping'
import ConfirmOrder from './screens/cart/ConfirmOrder'
import ListOrders from './screens/order/ListOrders'
import OrderDetails from './screens/order/OrderDetails'
import Dashboard from './screens/admin/Dashboard'
import AdminProducts from './screens/admin/AdminProducts'
import AdminProductAdd from './screens/admin/AdminProductAdd'
import AdminProductUpdate from './screens/admin/AdminProductUpdate'
import AdminOrders from './screens/admin/AdminOrders'
import AdminUsers from './screens/admin/AdminUsers'
import AdminReviews from './screens/admin/AdminReviews'
import AdminOrdersProcess from './screens/admin/AdminOrdersProcess'
import AdminUserUpdate from './screens/admin/AdminUserUpdate'
import AdminCategory from './screens/admin/AdminCategory'
import AdminCategoryAdd from './screens/admin/AdminCategoryAdd'
import AdminCategoryUpdate from './screens/admin/AdminCategoryUpdate'
import Contact from './screens/contact/contact'
import AdminBrand from './screens/admin/AdminBrands'
import AdminCoupons from './screens/admin/AdminCoupons'
import AdminBanners from './screens/admin/AdminBanners'
import AdminAnnouncements from './screens/admin/AdminAnnouncements'
import AdminBestSellers from './screens/admin/AdminBestSellers'
import AdminTestimonials from './screens/admin/AdminTestimonials'
import AdminBrandAdd from './screens/admin/AdminBrandAdd'
import AdminBrandUpdate from './screens/admin/AdminBrandUpdate'
import Brands from './screens/brand/brand'
import Wishlist from './screens/user/Wishlist'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './scrollTotp'

// Footer is hidden on admin views (dashboard + /admin/*)
const AppFooter = () => {
	const { pathname } = useLocation()
	const isAdminView = pathname === '/dashboard' || pathname.startsWith('/admin')
	if (isAdminView) return null
	return <Footer />
}

const App = () => {
	const { i18n } = useTranslation()

	useEffect(() => {
		store.dispatch(loadUser())
	}, [])

	// Apply text direction (RTL for Arabic) on language change
	useEffect(() => {
		const apply = (lng) => {
			const lang = lng || i18n.language || 'fr'
			const isRtl = lang === 'ar'
			document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
			document.documentElement.setAttribute('lang', lang)
			document.body.classList.toggle('rtl', isRtl)
		}
		apply(i18n.language)
		i18n.on('languageChanged', apply)
		return () => i18n.off('languageChanged', apply)
	}, [i18n])

	return (
		<>
			<Router>
				<ScrollToTop />
				<Header />
				<main>
					<Routes>
						<Route path='/' element={<Products />} exact />
						<Route path='/products' element={<Products />} exact />
						<Route path='/product/:id' element={<ProductDetails />} />

						<Route path='/cart' element={<Cart />} exact />
						<Route path='/shipping' element={<Shipping />} exact />
						<Route path='/confirm' element={<ConfirmOrder />} exact />
						<Route path='/contact' element={<Contact />} exact />
						<Route path='/brands' element={<Brands />} exact />
						<Route path='/wishlist' element={<Wishlist />} exact />

						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/forgot-password' element={<ForgotPassword />} />
						<Route path='/password/reset/:token' element={<ResetPassword />} />

						<Route element={<IsAuthenticatedRoutes />}>
							<Route path='/profile' element={<Profile />} />
							<Route path='/settings' element={<Settings />} />
							<Route path='/password-update' element={<UpdatePassword />} />

							<Route path='/orders' element={<ListOrders />} />
							<Route path='/order/:id' element={<OrderDetails />} />
						</Route>

						<Route element={<IsAdminRoutes />}>
							<Route path='/dashboard' element={<Dashboard />} exact />
							<Route path='/admin/products' element={<AdminProducts />} exact />
							<Route path='/admin/products/add' element={<AdminProductAdd />} exact />
							<Route
								path='/admin/product/:id'
								element={<AdminProductUpdate />}
								exact
							/>
							<Route path='/admin/orders' element={<AdminOrders />} exact />
							<Route path='/admin/order/:id' element={<AdminOrdersProcess />} exact />
							<Route path='/admin/users' element={<AdminUsers />} exact />
							<Route path='/admin/user/:id' element={<AdminUserUpdate />} exact />
							<Route path='/admin/reviews' element={<AdminReviews />} exact />
							<Route path='/admin/category' element={<AdminCategory />} exact />
							<Route
								path='/admin/category/add'
								element={<AdminCategoryAdd />}
								exact
							/>
							<Route
								path='/admin/category/:id'
								element={<AdminCategoryUpdate />}
								exact
							/>
							<Route path='/admin/brand' element={<AdminBrand />} exact />
							<Route path='/admin/coupons' element={<AdminCoupons />} exact />
							<Route path='/admin/banners' element={<AdminBanners />} exact />
							<Route path='/admin/announcements' element={<AdminAnnouncements />} exact />
							<Route path='/admin/best-sellers' element={<AdminBestSellers />} exact />
							<Route path='/admin/testimonials' element={<AdminTestimonials />} exact />
							<Route
								path='/admin/brand/add'
								element={<AdminBrandAdd />}
								exact
							/>
							<Route
								path='/admin/brand/:id'
								element={<AdminBrandUpdate />}
								exact
							/>
						</Route>
					</Routes>
				</main>
				<AppFooter />
				<WhatsAppButton />
			</Router>

			<ToastContainer />
		</>
	)
}

export default App

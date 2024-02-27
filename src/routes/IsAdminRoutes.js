import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const IsAdminRoutes = () => {
	const { loading, isAuthenticated, user } = useSelector((state) => state.auth)

	return (
		loading === false &&
		(isAuthenticated === false ? (
			<Navigate to='/login' />
		) : user && user.role !== 'admin' ? (
			<Navigate to='/no-access' />
		) : (
			<Outlet />
		))
	)
}

export default IsAdminRoutes

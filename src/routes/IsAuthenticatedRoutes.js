import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const IsAuthenticatedRoutes = () => {
	const { isAuthenticated, loading } = useSelector((state) => state.auth)

	return loading === false && (isAuthenticated === false ? <Navigate to='/login' /> : <Outlet />)
}

export default IsAuthenticatedRoutes

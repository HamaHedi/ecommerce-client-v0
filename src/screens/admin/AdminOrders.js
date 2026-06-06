import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { allOrders, deleteOrder, clearErrors } from '../../actions/orderActions'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

const AdminOrders = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, orders = [] } = useSelector((state) => state.allOrders)
	const { isDeleted } = useSelector((state) => state.order)

	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('')

	useEffect(() => {
		dispatch(allOrders())

		if (error) {
			toast.error(error, { position: toast.POSITION.TOP_RIGHT, className: 'm-2' })
			dispatch(clearErrors())
		}

		if (isDeleted) {
			toast.success('Order deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/orders')
			dispatch({ type: DELETE_ORDER_RESET })
		}
	}, [dispatch, error, isDeleted, navigate])

	const deleteOrderHandler = (id) => dispatch(deleteOrder(id))

	const filtered = useMemo(() => {
		return (orders || []).filter((o) => {
			if (statusFilter && o.orderStatus !== statusFilter) return false
			if (search) {
				const q = search.toLowerCase()
				const hay = `${o._id} ${o.deliveryGovernorate || ''} ${o.shippingInfo?.phoneNo || ''}`.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	}, [orders, statusFilter, search])

	const exportCSV = () => {
		const headers = ['id', 'date', 'items', 'amount', 'status', 'governorate', 'phone', 'coupon', 'discount']
		const rows = filtered.map((o) => ({
			id: o._id,
			date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
			items: (o.orderItems || []).length,
			amount: o.totalPrice,
			status: o.orderStatus,
			governorate: o.deliveryGovernorate || '',
			phone: o.shippingInfo?.phoneNo || '',
			coupon: o.couponCode || '',
			discount: o.discount || 0,
		}))
		const csv = [
			headers.join(','),
			...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
		].join('\n')
		const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'commandes.csv'
		a.click()
		URL.revokeObjectURL(url)
	}

	const setOrders = () => {
		const data = {
			columns: [
				{ label: 'ID', field: 'id', sort: 'asc' },
				{ label: 'Date', field: 'date', sort: 'asc' },
				{ label: 'Articles', field: 'numofItems', sort: 'asc' },
				{ label: 'Montant', field: 'amount', sort: 'asc' },
				{ label: 'Gouvernorat', field: 'gov', sort: 'asc' },
				{ label: 'Statut', field: 'status', sort: 'asc' },
				{ label: 'Actions', field: 'actions' },
			],
			rows: [],
		}

		filtered.forEach((order) => {
			data.rows.push({
				id: String(order._id).slice(-8),
				date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—',
				numofItems: order.orderItems.length,
				amount: `DT ${order.totalPrice}`,
				gov: order.deliveryGovernorate || '—',
				status: (
					<span className={`order-status-badge s-${(order.orderStatus || '').toLowerCase()}`}>
						{order.orderStatus}
					</span>
				),
				actions: (
					<div className='d-flex text-nowrap'>
						<Link to={`/admin/order/${order._id}`} className='btn btn-primary py-1 px-2'>
							<i className='fa fa-eye'></i>
						</Link>
						<button className='btn btn-danger py-1 px-2 ml-2' onClick={() => deleteOrderHandler(order._id)}>
							<i className='fa fa-trash'></i>
						</button>
					</div>
				),
			})
		})

		return data
	}

	return (
		<section className='container-fluid admin-page'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div className='col-12 col-md-2 admin-nav-col'>
					<Sidebar item='orders' />
				</div>

				<div className='col-12 col-md-10 admin-content-col'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between align-items-center'>
							<h3 className='mb-0'>Commandes</h3>
							<button type='button' className='btn admin-export-btn' onClick={exportCSV}>
								<i className='fa fa-download'></i>&nbsp; Exporter CSV
							</button>
						</div>

						<div className='admin-filters'>
							<div className='admin-filter' style={{ flex: '2 1 240px' }}>
								<label>Recherche (ID / téléphone / gouvernorat)</label>
								<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Rechercher…' />
							</div>
							<div className='admin-filter'>
								<label>Statut</label>
								<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
									<option value=''>Tous</option>
									{STATUSES.map((s) => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</div>
							<button className='admin-filter-reset' onClick={() => { setSearch(''); setStatusFilter('') }}>
								<i className='fa fa-refresh'></i> Réinitialiser
							</button>
						</div>

						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setOrders()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={filtered && filtered.length > 10 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total affiché : {filtered.length} / {orders.length}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminOrders

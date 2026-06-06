import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {  deleteCategory, clearErrors } from '../../actions/categoryAction'
import { DELETE_CATEGORY_REQUEST } from '../../constants/categoryConstants'
import { deleteBrand, getBrands } from '../../actions/brandActions'
import { DELETE_BRAND_REQUEST } from '../../constants/brandConstants'

const AdminBrand = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, brands, brandsCount } = useSelector((state) => state.brands)
	const { error: deleteError, isDeleted } = useSelector((state) => state.brands)
	useEffect(() => {
		dispatch(getBrands())

		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (deleteError) {
			toast.error(deleteError, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isDeleted) {
			toast.success('Brand deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/brand')
			dispatch({ type: DELETE_BRAND_REQUEST })
		}
	}, [dispatch, error, deleteError, isDeleted, navigate])

	const deleteBrandyHandler = (id) => {
		dispatch(deleteBrand(id))
	}

	const setBrands = () => {
		const data = {
			columns: [
				{
					label: 'ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Title',
					field: 'title',
					sort: 'asc',
				},
				{
					label: 'Image',
					field: 'image',
					sort: 'asc',
				},
				{
					label: 'Description',
					field: 'description',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
				},
			],
			rows: [],
		}

		brands?.forEach((item) => {
			data.rows.push({
				id: item._id,
				title: item.title,
				image: (
					<img
						src={item && item.images[0] && 'https://api.lagha.shop/' + item.images[0].path}
						alt={item && item.images[0] && 'http://api.lagha.shop/' + item.images[0]._id}
						style={{ width: '100px', height: '100px' }}
					/>
				),
				description: item.description,
				actions: (
					<div className='d-flex text-nowrap'>
						<Link
							to={`/admin/brand/${item._id}`}
							className='btn btn-primary py-1 px-2'
						>
							<i className='fa fa-pencil'></i>
						</Link>
						<button
							className='btn btn-danger py-1 px-2 ml-2'
							onClick={() => deleteBrandyHandler(item._id)}
						>
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
				<div
					className='col-12 col-md-2 admin-nav-col'
				>
					<Sidebar item='brand' />
				</div>

				<div className='col-12 col-md-10 admin-content-col'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between'>
							<h3 className='mb-0'>Bands</h3>
							<Link to='/admin/brand/add' className='btn btn-success'>
								<i className='fa fa-plus' aria-hidden='true'></i>
							</Link>
						</div>
						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setBrands()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={brands && brandsCount > 8 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total: {brands && brandsCount}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminBrand

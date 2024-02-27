import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory, deleteCategory, clearErrors } from '../../actions/categoryAction'
import { DELETE_CATEGORY_REQUEST } from '../../constants/categoryConstants'

const AdminCategory = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { loading, error, category } = useSelector((state) => state.categorys)
	const { error: deleteError, isDeleted } = useSelector((state) => state.category)

	useEffect(() => {
		dispatch(getCategory())

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
			toast.success('Category deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/category')
			dispatch({ type: DELETE_CATEGORY_REQUEST })
		}
	}, [dispatch, error, deleteError, isDeleted, navigate])

	const deleteCategoryHandler = (id) => {
		dispatch(deleteCategory(id))
	}

	const setCategorys = () => {
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

		category.forEach((item) => {
			data.rows.push({
				id: item._id,
				title: item.title,
				description: item.description,
				actions: (
					<div className='d-flex text-nowrap'>
						<Link
							to={`/admin/category/${item._id}`}
							className='btn btn-primary py-1 px-2'
						>
							<i className='fa fa-pencil'></i>
						</Link>
						<button
							className='btn btn-danger py-1 px-2 ml-2'
							onClick={() => deleteCategoryHandler(item._id)}
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
		<section className='container my-4'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-3 px-3 py-4 my-4'
					style={{ backgroundColor: '#1A2D3C', borderRadius: '10px' }}
				>
					<Sidebar item='category' />
				</div>

				<div className='col-12 col-md-9 px-3  my-4'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between'>
							<h3 className='mb-0'>Categories</h3>
							<Link to='/admin/category/add' className='btn btn-success'>
								<i className='fa fa-plus' aria-hidden='true'></i>
							</Link>
						</div>
						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setCategorys()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={category && category.length > 10 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total: {category && category.length}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminCategory

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { allUsers, deleteUser, clearErrors } from '../../actions/userActions'
import { DELETE_USER_RESET } from '../../constants/userConstants'
import Pagination from 'react-js-pagination'

const AdminUsers = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1);

	const { loading, error, users, pagination } = useSelector((state) => state.allUsers)
	const { isDeleted } = useSelector((state) => state.user)
	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}
	useEffect(() => {
		dispatch(allUsers(currentPage))

		if (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			dispatch(clearErrors())
		}

		if (isDeleted) {
			toast.success('User deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/users')
			dispatch({ type: DELETE_USER_RESET })
		}
	}, [dispatch, error, isDeleted, navigate, currentPage])

	const deleteUserHandler = (id) => {
		dispatch(deleteUser(id))
	}

	const setUsers = () => {
		const data = {
			columns: [
				{
					label: 'User ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Avatar',
					field: 'avatar',
					sort: 'asc',
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc',
				},
				{
					label: 'Email',
					field: 'email',
					sort: 'asc',
				},
				{
					label: 'Role',
					field: 'role',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
				},
			],
			rows: [],
		}

		users.forEach((user) => {
			data.rows.push({
				id: user._id,
				avatar: (
					<img
						src={'http://localhost:8000/' + user.avatar}
						alt={user.avatar}
						style={{ width: '80px', height: '80px', borderRadius: '5px' }}
					/>
				),
				name: user.name,
				email: user.email,
				role: user.role,

				actions: (
					<div className='d-flex text-nowrap'>
						<Link to={`/admin/user/${user._id}`} className='btn btn-primary py-1 px-2'>
							<i className='fa fa-pencil'></i>
						</Link>
						<button
							className='btn btn-danger py-1 px-2 ml-2'
							onClick={() => deleteUserHandler(user._id)}
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
					<Sidebar item='users' />
				</div>

				<div className='col-12 col-md-9 px-3 my-4'>
					<div className='card border h-100'>
						<div className='card-header'>
							<h3 className='mb-0'>Users</h3>
						</div>
						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setUsers()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={users && users.length > 10 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total: {pagination && pagination?.totalUsers}</div>
						<div
							className="d-flex justify-content-center"
							style={{ paddingTop: "15px" }}
						>
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={5}
								totalItemsCount={pagination?.totalUsers}
								onChange={setCurrentPageNo}
								nextPageText={"›"}
								prevPageText={"‹"}
								firstPageText={"«"}
								lastPageText={"»"}
								itemClass="page-item"
								linkClass="page-link"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminUsers

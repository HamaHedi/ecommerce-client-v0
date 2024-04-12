import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'
import Pagination from "react-js-pagination";

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const AdminProducts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1);
	const { loading, error, products, pagination } = useSelector((state) => state.products)
	const { error: deleteError, isDeleted } = useSelector((state) => state.product)

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}
	useEffect(() => {
		dispatch(getAdminProducts(currentPage))

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
			toast.success('Product deleted successfully', {
				position: toast.POSITION.TOP_RIGHT,
				className: 'm-2',
			})
			navigate('/admin/products')
			dispatch({ type: DELETE_PRODUCT_RESET })
		}
	}, [dispatch, error, deleteError, isDeleted, navigate, currentPage])

	const deleteProductHandler = (id) => {
		dispatch(deleteProduct(id))
	}

	const setProducts = () => {
		const data = {
			columns: [
				{
					label: 'ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Image',
					field: 'image',
					sort: 'asc',
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc',
				},
				{
					label: 'Price',
					field: 'price',
					sort: 'asc',
				},
				{
					label: 'Stock',
					field: 'stock',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
				},
			],
			rows: [],
		}

		products.forEach((product) => {
			data.rows.push({
				id: product._id,
				image: (
					<img
						src={product && product.images[0] && 'https://api.lagha.shop/' + product.images[0].path}
						alt={product && product.images[0] && 'https://api.lagha.shop/' + product.images[0]._id}
						style={{ width: '100px', height: '100px' }}
					/>
				),
				name: product.name,
				price: `$${product.price}`,
				stock: product.stock,
				actions: (
					<div className='d-flex text-nowrap'>
						<Link
							to={`/admin/product/${product._id}`}
							className='btn btn-primary py-1 px-2'
						>
							<i className='fa fa-pencil'></i>
						</Link>
						<button
							className='btn btn-danger py-1 px-2 ml-2'
							onClick={() => deleteProductHandler(product._id)}
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
					<Sidebar item='products' />
				</div>

				<div className='col-12 col-md-9 px-3  my-4'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between'>
							<h3 className='mb-0'>Products</h3>
							<Link to='/admin/products/add' className='btn btn-success'>
								<i className='fa fa-plus' aria-hidden='true'></i>
							</Link>
						</div>
						<div className='card-body px-0'>
							{loading ? (
								<Loader />
							) : (
								<MDBDataTable
									data={setProducts()}
									className='text-center px-3'
									bordered
									striped
									hover
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={products && products.length > 10 ? true : false}
								/>
							)}
						</div>
						<div className='card-footer'>Total: {pagination && pagination?.totalProducts}</div>
						<div
							className="d-flex justify-content-center"
							style={{ paddingTop: "15px" }}
						>
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={5}
								totalItemsCount={pagination?.totalProducts}
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

export default AdminProducts

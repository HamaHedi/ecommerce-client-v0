import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'
import Pagination from "react-js-pagination";

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'
import { getCategory } from '../../actions/categoryAction'
import { getBrands } from '../../actions/brandActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const AdminProducts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1);
	const { loading, error, products, pagination } = useSelector((state) => state.products)
	const { error: deleteError, isDeleted } = useSelector((state) => state.product)
	const { category: allCategory } = useSelector((state) => state.categorys)
	const { brands } = useSelector((state) => state.brands)
	const [searchString, setSearchString] = useState("")
	const [filterCategory, setFilterCategory] = useState("")
	const [filterBrand, setFilterBrand] = useState("")
	const [filterStock, setFilterStock] = useState("")
	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber);
	}

	const resetFilters = () => {
		setSearchString("")
		setFilterCategory("")
		setFilterBrand("")
		setFilterStock("")
		setCurrentPage(1)
	}

	const importRef = useRef(null)

	const parseCSV = (text) => {
		// Strip BOM and an optional Excel "sep=;" hint line
		let lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim())
		if (lines.length && /^sep=/i.test(lines[0])) lines = lines.slice(1)
		if (!lines.length) return []
		// Auto-detect the delimiter from the header line (handles ; and ,)
		const delim = lines[0].split('"').filter((_, i) => i % 2 === 0).join('').includes(';') ? ';' : ','
		const parseLine = (line) => {
			const out = []; let cur = ''; let q = false
			for (let i = 0; i < line.length; i++) {
				const c = line[i]
				if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++ } else q = false } else cur += c }
				else { if (c === '"') q = true; else if (c === delim) { out.push(cur); cur = '' } else cur += c }
			}
			out.push(cur); return out
		}
		const headers = parseLine(lines[0]).map((h) => h.trim())
		return lines.slice(1).map((l) => { const v = parseLine(l); const o = {}; headers.forEach((h, i) => (o[h] = v[i])); return o })
	}

	const importCSV = (e) => {
		const file = e.target.files[0]; if (!file) return
		const reader = new FileReader()
		reader.onload = async (ev) => {
			const rows = parseCSV(String(ev.target.result))
			if (!rows.length) { toast.error('CSV vide'); return }
			try {
				const { data } = await axios.post(`${API_BASE}/api/admin/products/import`, { products: rows }, { headers: { Authorization: localStorage.getItem('token') } })
				toast.success(`${data.updated} produit(s) mis à jour`)
				dispatch(getAdminProducts(currentPage, searchString))
			} catch (err) { toast.error(err?.response?.data?.message || 'Import échoué') }
			e.target.value = ''
		}
		reader.readAsText(file)
	}

	const downloadTemplate = () => {
		const csv = 'sep=;\nid;name;brand;category;price;oldPrice;stock\n66f16667ddbc19cfec415914;PURE PIGMENTS;Togethair;Coiffure;28;0;15\n66f94e81ddbc19cfec4198d9;crème oxygénée;Togethair;Coiffure;9;12;40\n'
		const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a'); a.href = url; a.download = 'modele-import-produits.csv'; a.click(); URL.revokeObjectURL(url)
	}

	const buildAndDownloadCSV = (list) => {
		const rows = (list || []).map((p) => ({ id: p._id, name: p.name, brand: p.brand || '', category: p.category || '', price: p.price, oldPrice: p.oldPrice || 0, stock: p.stock }))
		const headers = ['id', 'name', 'brand', 'category', 'price', 'oldPrice', 'stock']
		const csv = 'sep=;\n' + [headers.join(';'), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(';'))].join('\n')
		const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url; a.download = 'produits.csv'; a.click(); URL.revokeObjectURL(url)
	}

	const exportCSV = () => buildAndDownloadCSV(products)

	const [exportingAll, setExportingAll] = useState(false)
	const exportAllCSV = async () => {
		setExportingAll(true)
		try {
			const config = { headers: { Authorization: localStorage.getItem('token') } }
			let url = `${API_BASE}/api/admin/products?page=1&limit=100000&search=${encodeURIComponent(searchString)}`
			if (filterCategory) url += `&category=${encodeURIComponent(filterCategory)}`
			if (filterBrand) url += `&brand=${encodeURIComponent(filterBrand)}`
			if (filterStock) url += `&stock=${encodeURIComponent(filterStock)}`
			const { data } = await axios.get(url, config)
			const all = data?.products || []
			if (!all.length) { toast.error('Aucun produit à exporter'); return }
			buildAndDownloadCSV(all)
			toast.success(`${all.length} produit(s) exporté(s)`)
		} catch (err) {
			toast.error(err?.response?.data?.message || "Échec de l'export")
		} finally {
			setExportingAll(false)
		}
	}

	useEffect(() => {
		dispatch(getCategory())
		dispatch(getBrands("", "", ""))
	}, [dispatch])

	useEffect(() => {
		dispatch(getAdminProducts(currentPage, searchString, filterCategory, filterBrand, filterStock))

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
	}, [dispatch, error, deleteError, isDeleted, navigate, currentPage, searchString, filterCategory, filterBrand, filterStock])

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

		// Category / brand / stock filtering and pagination are handled server-side
		// (see getAdminProducts), so render the page exactly as the server returns it.
		const filtered = (products || [])

		filtered.forEach((product) => {
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
				price: `DT ${product.price}`,
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
		<section className='container-fluid admin-page'>
			<div className='row' style={{ minHeight: '80vh' }}>
				<div
					className='col-12 col-md-2 admin-nav-col'
				>
					<Sidebar item='products' />
				</div>

				<div className='col-12 col-md-10 admin-content-col'>
					<div className='card border h-100'>
						<div className='card-header d-flex justify-content-between'>
							<h3 className='mb-0'>Produits</h3>
							<div style={{ display: 'flex', gap: '10px' }}>
								<button type='button' className='btn admin-export-btn' onClick={exportCSV}><i className='fa fa-download' aria-hidden='true'></i>&nbsp; Exporter (page)</button>
									<button type='button' className='btn admin-export-btn' onClick={exportAllCSV} disabled={exportingAll}><i className={`fa ${exportingAll ? 'fa-spinner fa-spin' : 'fa-download'}`} aria-hidden='true'></i>&nbsp; Exporter tout</button>
									<button type='button' className='btn admin-export-btn' onClick={() => importRef.current && importRef.current.click()}><i className='fa fa-upload' aria-hidden='true'></i>&nbsp; Importer CSV</button>
									<input type='file' ref={importRef} accept='.csv' style={{ display: 'none' }} onChange={importCSV} />
									<button type='button' className='btn admin-export-btn' onClick={downloadTemplate}><i className='fa fa-file-text-o' aria-hidden='true'></i>&nbsp; Modèle CSV</button>
								<Link to='/admin/products/add' className='btn btn-success'><i className='fa fa-plus' aria-hidden='true'></i>&nbsp; Ajouter</Link>
							</div>
						</div>

						<div className='admin-import-hint'><i className='fa fa-info-circle'></i> Import : exportez vos produits, modifiez <b>price / oldPrice / stock</b> dans Excel, puis réimportez. La colonne <b>id</b> doit correspondre à un produit existant. <a href='/exemple-import-produits.csv' download>Voir un exemple</a></div>

						<div className='admin-filters'>
							<div className='admin-filter' style={{ flex: '2 1 220px' }}>
								<label>Recherche</label>
								<input type='text' placeholder='Nom du produit…' value={searchString} onChange={(e) => { setSearchString(e.target.value); setCurrentPage(1) }} />
							</div>
							<div className='admin-filter'>
								<label>Catégorie</label>
								<select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1) }}>
									<option value=''>Toutes</option>
									{allCategory?.map((c) => (<option key={c._id || c.title} value={c.title}>{c.title}</option>))}
								</select>
							</div>
							<div className='admin-filter'>
								<label>Marque</label>
								<select value={filterBrand} onChange={(e) => { setFilterBrand(e.target.value); setCurrentPage(1) }}>
									<option value=''>Toutes</option>
									{brands?.map((b) => (<option key={b.id || b.title} value={b.title}>{b.title}</option>))}
								</select>
							</div>
							<div className='admin-filter'>
								<label>Stock</label>
								<select value={filterStock} onChange={(e) => { setFilterStock(e.target.value); setCurrentPage(1) }}>
									<option value=''>Tous</option>
									<option value='in'>En stock</option>
									<option value='out'>Rupture</option>
								</select>
							</div>
							<button className='admin-filter-reset' onClick={resetFilters}><i className='fa fa-refresh' aria-hidden='true'></i> Réinitialiser</button>
						</div>

						<div className='card-body px-0'>
							{
								<MDBDataTable
									data={setProducts()}
									className='text-center px-3'
									bordered
									striped
									hover
									onSearch={(e) => setSearchString(e)}
									noBottomColumns
									responsive
									info={false}
									paginationLabel={['<', '>']}
									paging={products && products.length > 10 ? true : false}
								/>
							}
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

import axios from "axios";

import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	ADMIN_PRODUCTS_REQUEST,
	ADMIN_PRODUCTS_SUCCESS,
	ADMIN_PRODUCTS_FAIL,
	NEW_PRODUCT_REQUEST,
	NEW_PRODUCT_SUCCESS,
	NEW_PRODUCT_FAIL,
	DELETE_PRODUCT_REQUEST,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAIL,
	UPDATE_PRODUCT_REQUEST,
	UPDATE_PRODUCT_SUCCESS,
	UPDATE_PRODUCT_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	NEW_REVIEW_REQUEST,
	NEW_REVIEW_SUCCESS,
	NEW_REVIEW_FAIL,
	GET_REVIEWS_REQUEST,
	GET_REVIEWS_SUCCESS,
	GET_REVIEWS_FAIL,
	DELETE_REVIEW_REQUEST,
	DELETE_REVIEW_SUCCESS,
	DELETE_REVIEW_FAIL,
	CLEAR_ERRORS,
	GET_STATISTICS_SUCCESS,
	GET_STATISTICS_REQUEST,
	GET_STATISTICS_FAIL,
	GET_PRODUCTS_PROMO_REQUEST,
	GET_PRODUCTS_PROMO_FAIL,
	GET_PRODUCTS_PROMO_SUCCESS,
	GET_NEW_PRODUCT_FAIL,
	GET_NEW_PRODUCT_REQUEST,
	GET_NEW_PRODUCT_SUCCESS
} from "../constants/productConstants";

export const getProducts =
	(keyword = "", currentPage = 1, price, category, rating = 0, subCategory, brand) =>
		async (dispatch) => {
			try {
				dispatch({ type: ALL_PRODUCTS_REQUEST });

				// Base URL
				let link = `https://api.lagha.shop/api/products?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;

				// Add category if it's not empty
				if (category !== "") {
					link += `&category=${encodeURIComponent(category)}`;
				}

				// Add subCategory if it's not empty
				if (subCategory !== "") {
					link += `&subcategory=${encodeURIComponent(subCategory)}`;
				}

				// Add brand if it's not empty
				if (brand !== "") {
					link += `&brand=${encodeURIComponent(brand)}`;
				}

				// Fetch data from API
				const { data } = await axios.get(link);

				dispatch({
					type: ALL_PRODUCTS_SUCCESS,
					payload: data,
				});
			} catch (error) {
				dispatch({
					type: ALL_PRODUCTS_FAIL,
					payload: error.response?.data?.message || "Something went wrong",
				});
			}
		};

export const getNewProduct = () => async (dispatch) => {
	try {
		dispatch({ type: GET_NEW_PRODUCT_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.get(
			`https://api.lagha.shop/api/new-product`, config
		);

		dispatch({
			type: GET_NEW_PRODUCT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_NEW_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const getProductPromo = () => async (dispatch) => {
	try {
		dispatch({ type: GET_PRODUCTS_PROMO_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.get(
			`https://api.lagha.shop/api/products-promo`, config
		);

		dispatch({
			type: GET_PRODUCTS_PROMO_SUCCESS,
			payload: data.promoProducts,
		});
	} catch (error) {
		dispatch({
			type: GET_PRODUCTS_PROMO_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const getProductDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.get(
			`https://api.lagha.shop/api/products/${id}`, config
		);

		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data.product,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const newProduct = (productData) => async (dispatch) => {
	try {
		dispatch({ type: NEW_PRODUCT_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"Authorization": token

			},
		};

		const { data } = await axios.post(
			`https://api.lagha.shop/api/admin/products`,
			productData,
			config
		);

		dispatch({
			type: NEW_PRODUCT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: NEW_PRODUCT_FAIL,
			payload: error.response.data,
		});
	}
};

// Delete product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
	try {
		dispatch({ type: DELETE_PRODUCT_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.delete(
			`https://api.lagha.shop/api/admin/products/${id}`, config
		);

		dispatch({
			type: DELETE_PRODUCT_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Update Product (ADMIN)
export const updateProduct = (id, productData) => async (dispatch) => {
	try {
		dispatch({ type: UPDATE_PRODUCT_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Content-Type": "application/json",
				"Authorization": token

			},
		};

		const { data } = await axios.put(
			`https://api.lagha.shop/api/admin/products/${id}`,
			productData,
			config
		);

		dispatch({
			type: UPDATE_PRODUCT_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_PRODUCT_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const newReview = (reviewData) => async (dispatch) => {
	try {
		dispatch({ type: NEW_REVIEW_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Content-Type": "application/json",
				"Authorization": token

			},
		};


		const { data } = await axios.put(
			`https://api.lagha.shop/api/review`,
			reviewData,
			config
		);

		dispatch({
			type: NEW_REVIEW_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: NEW_REVIEW_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const getAdminProducts = (currentPage, search, category = "", brand = "", stock = "") => async (dispatch) => {
	try {
		dispatch({ type: ADMIN_PRODUCTS_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Authorization": token

			},
		};

		let link = `https://api.lagha.shop/api/admin/products?page=${currentPage}&search=${encodeURIComponent(search || "")}`;
		if (category) link += `&category=${encodeURIComponent(category)}`;
		if (brand) link += `&brand=${encodeURIComponent(brand)}`;
		if (stock) link += `&stock=${encodeURIComponent(stock)}`;

		const { data } = await axios.get(link, config);

		dispatch({
			type: ADMIN_PRODUCTS_SUCCESS,
			payload: data.products,
			pagination: data?.pagination
		});
	} catch (error) {
		dispatch({
			type: ADMIN_PRODUCTS_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const getStatistics = () => async (dispatch) => {
	try {
		dispatch({ type: GET_STATISTICS_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Authorization": token

			},
		};

		const data = await axios.get(
			`https://api.lagha.shop/api/statistics`, config
		);

		dispatch({
			type: GET_STATISTICS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_STATISTICS_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Get product reviews
export const getProductReviews = (id) => async (dispatch) => {
	try {
		dispatch({ type: GET_REVIEWS_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.get(
			`https://api.lagha.shop/api/reviews?id=${id}`, config
		);

		dispatch({
			type: GET_REVIEWS_SUCCESS,
			payload: data.reviews,
		});
	} catch (error) {
		dispatch({
			type: GET_REVIEWS_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Delete product review
export const deleteReview = (id, productId) => async (dispatch) => {
	try {
		dispatch({ type: DELETE_REVIEW_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.delete(
			`https://api.lagha.shop/api/reviews?id=${id}&productId=${productId}`, config
		);

		dispatch({
			type: DELETE_REVIEW_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_REVIEW_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};

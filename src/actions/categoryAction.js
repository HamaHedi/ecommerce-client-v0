import axios from "axios";

import {
	ALL_CATEGORY_REQUEST,
	ALL_CATEGORY_SUCCESS,
	ALL_CATEGORY_FAIL,
	NEW_CATEGORY_REQUEST,
	NEW_CATEGORY_SUCCESS,
	NEW_CATEGORY_FAIL,
	UPDATE_CATEGORY_REQUEST,
	UPDATE_CATEGORY_SUCCESS,
	UPDATE_CATEGORY_FAIL,
	DELETE_CATEGORY_REQUEST,
	DELETE_CATEGORY_SUCCESS,
	DELETE_CATEGORY_FAIL,
	CATEGORY_DETAILS_REQUEST,
	CATEGORY_DETAILS_SUCCESS,
	CATEGORY_DETAILS_FAIL,
	CLEAR_ERRORS,
} from "../constants/categoryConstants";

export const getCategory = () => async (dispatch) => {
	try {
		dispatch({ type: ALL_CATEGORY_REQUEST });

		const { data } = await axios.get(
			`http://localhost:8000/api/admin/category`
		);

		dispatch({
			type: ALL_CATEGORY_SUCCESS,
			payload: data.category,
		});
	} catch (error) {
		dispatch({
			type: ALL_CATEGORY_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const getCategoryDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: CATEGORY_DETAILS_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token,


			},
		};
		const { data } = await axios.get(
			`http://localhost:8000/api/admin/category/${id}`, config
		);

		dispatch({
			type: CATEGORY_DETAILS_SUCCESS,
			payload: data.category,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const newCategory = (categoryData) => async (dispatch) => {
	try {
		dispatch({ type: NEW_CATEGORY_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token,
				"Content-Type": "application/json",

			},
		};


		const { data } = await axios.post(
			`http://localhost:8000/api/admin/category`,
			categoryData,
			config
		);

		dispatch({
			type: NEW_CATEGORY_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: NEW_CATEGORY_FAIL,
			payload: error.response.data,
		});
	}
};

export const updateCategory = (id, categoryData) => async (dispatch) => {
	try {
		dispatch({ type: UPDATE_CATEGORY_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Content-Type": "application/json",
				"Authorization": token,

			},
		};

		const { data } = await axios.put(
			`http://localhost:8000/api/admin/category/${id}`,
			categoryData,
			config
		);

		dispatch({
			type: UPDATE_CATEGORY_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_CATEGORY_FAIL,
			payload: error.response.data.message,
		});
	}
};

export const deleteCategory = (id) => async (dispatch) => {
	try {
		dispatch({ type: DELETE_CATEGORY_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token,


			},
		}
		const { data } = await axios.delete(
			`http://localhost:8000/api/admin/category/${id}`, config
		);

		dispatch({
			type: DELETE_CATEGORY_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_CATEGORY_FAIL,
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

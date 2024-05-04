import axios from "axios";

import {
  ALL_BRANDS_REQUEST,
  ALL_BRANDS_SUCCESS,
  ALL_BRANDS_FAIL,
  NEW_BRAND_REQUEST,
  NEW_BRAND_SUCCESS,
  NEW_BRAND_RESET,
  NEW_BRAND_FAIL,
  DELETE_BRAND_REQUEST,
  DELETE_BRAND_FAIL,
  DELETE_BRAND_SUCCESS,
  DELETE_BRAND_RESET,
  UPDATE_BRAND_SUCCESS,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_REQUEST,
  UPDATE_BRAND_RESET,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_FAIL,
  BRAND_DETAILS_SUCCESS,
  CLEAR_ERRORS
} from "../constants/brandConstants";

export const getBrands =
  (keyword = "", currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_BRANDS_REQUEST });

      let link = `https://api.lagha.shop/api/brands?keyword=${keyword}&page=${currentPage}`;

      const { data } = await axios.get(link);

      dispatch({
        type: ALL_BRANDS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_BRANDS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const newBrand = (brandData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_BRAND_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    };

    const { data } = await axios.post(
      `https://api.lagha.shop/api/brands`,
      brandData,
      config
    );

    dispatch({
      type: NEW_BRAND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BRAND_FAIL,
      payload: error.response.data,
    });
  }
};
export const deleteBrand = (id) => async (dispatch) => {
	try {
		dispatch({ type: DELETE_BRAND_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.delete(
			`https://api.lagha.shop/api/brands/${id}`, config
		);

		dispatch({
			type: DELETE_BRAND_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: DELETE_BRAND_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const getBrandDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: BRAND_DETAILS_REQUEST });
		const token = localStorage.getItem('token');

		const config = {
			headers: {
				"Authorization": token

			},
		};
		const { data } = await axios.get(
			`https://api.lagha.shop/api/brands/${id}`, config
		);

		dispatch({
			type: BRAND_DETAILS_SUCCESS,
			payload: data.brand,
		});
	} catch (error) {
		dispatch({
			type: BRAND_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const updateBrand = (id, brandData) => async (dispatch) => {
	try {
		dispatch({ type: UPDATE_BRAND_REQUEST });
		const token = localStorage.getItem('token');


		const config = {
			headers: {
				"Content-Type": "application/json",
				"Authorization": token

			},
		};

		const { data } = await axios.put(
			`https://api.lagha.shop/api/brands/${id}`,
			brandData,
			config
		);

		dispatch({
			type: UPDATE_BRAND_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_BRAND_FAIL,
			payload: error.response.data.message,
		});
	}
};
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};

import axios from "axios";

import {
  ALL_BRANDS_REQUEST,
  ALL_BRANDS_SUCCESS,
  ALL_BRANDS_FAIL,
} from "../constants/brandConstants";

export const getBrands =
  (keyword = "", currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_BRANDS_REQUEST });

      let link = `http://localhost:8000/api/brands?keyword=${keyword}&page=${currentPage}`;

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

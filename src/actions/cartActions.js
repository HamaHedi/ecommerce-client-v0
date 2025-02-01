import axios from "axios";
import {
	ADD_TO_CART,
	REMOVE_ITEM_CART,
	SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const addItemToCart = (id, quantity, value, selectedColor,selectedImage) => async (dispatch, getState) => {
	const { data } = await axios.get(`https://api.lagha.shop/api/products/${id}`);

	dispatch({
		type: ADD_TO_CART,
		payload: {
			product: data.product._id,
			name: data.product.name,
			price: value?.sizePrice ? Number(value?.sizePrice) : data.product.price,
			image: data.product.images[0].path,
			stock: data.product.stock,
			color: selectedColor,
			size: value?.sizeName,
			teint:selectedImage,
			quantity,
		},
	});

	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeItemFromCart = (id) => async (dispatch, getState) => {
	dispatch({
		type: REMOVE_ITEM_CART,
		payload: id,
	});

	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
	dispatch({
		type: SAVE_SHIPPING_INFO,
		payload: data,
	});

	localStorage.setItem("shippingInfo", JSON.stringify(data));
};

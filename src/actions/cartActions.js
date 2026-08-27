import axios from "axios";
import {
	ADD_TO_CART,
	REMOVE_ITEM_CART,
	SAVE_SHIPPING_INFO,
	CLEAR_CART,
	UPDATE_CART_QTY,
} from "../constants/cartConstants";

// Identité d'une ligne du panier. Un même produit peut être commandé dans
// plusieurs teintes / tailles / volumes : c'est cette combinaison qui distingue
// deux lignes, pas seulement l'id du produit.
export const cartLineId = (item) =>
	item?.lineId ||
	[
		item?.product,
		item?.teintRef || "",
		item?.size || "",
		item?.volume || "",
		item?.color || "",
	].join("|");

export const addItemToCart =
	(id, quantity, value, selectedColor, selectedImage, selectedVolume, teinte) =>
	async (dispatch, getState) => {
		const { data } = await axios.get(
			`https://api.lagha.shop/api/products/${id}`
		);

		const item = {
			product: data.product._id,
			name: data.product.name,
			price: value?.sizePrice ? Number(value?.sizePrice) : data.product.price,
			image: data.product.images[0].path,
			stock: data.product.stock,
			color: selectedColor,
			size: value?.sizeName,
			volume: selectedVolume?.volume,
			volumeRef: selectedVolume?.reference,
			teint: teinte?.img || selectedImage,
			teintRef: teinte?.reference,
			teintName: teinte?.name,
			quantity,
		};

		dispatch({
			type: ADD_TO_CART,
			payload: { ...item, lineId: cartLineId(item) },
		});

		localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
	};

export const removeItemFromCart = (lineId) => async (dispatch, getState) => {
	dispatch({
		type: REMOVE_ITEM_CART,
		payload: lineId,
	});

	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Change la quantité d'une ligne sans repasser par l'API : évite de perdre la
// teinte / le volume déjà choisis sur cette ligne.
export const updateCartItemQty =
	(lineId, quantity) => async (dispatch, getState) => {
		dispatch({
			type: UPDATE_CART_QTY,
			payload: { lineId, quantity },
		});

		localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
	};

export const clearCart = () => async (dispatch) => {
	dispatch({
		type: CLEAR_CART,
	});

	localStorage.removeItem("cartItems");
};

export const saveShippingInfo = (data) => async (dispatch) => {
	dispatch({
		type: SAVE_SHIPPING_INFO,
		payload: data,
	});

	localStorage.setItem("shippingInfo", JSON.stringify(data));
};

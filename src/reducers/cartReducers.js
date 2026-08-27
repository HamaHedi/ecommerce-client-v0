import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART, UPDATE_CART_QTY } from '../constants/cartConstants'
import { cartLineId } from '../actions/cartActions'

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {

        case ADD_TO_CART:
            const item = action.payload;

            // Deux teintes du même produit sont deux lignes distinctes : on ne
            // fusionne que si toute la combinaison (produit + teinte + taille +
            // volume + couleur) est identique.
            const isItemExist = state.cartItems.find(i => cartLineId(i) === cartLineId(item))

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i =>
                        cartLineId(i) === cartLineId(isItemExist) ? item : i
                    )
                }
            }

            return {
                ...state,
                cartItems: [...state.cartItems, item]
            }

        case UPDATE_CART_QTY:
            return {
                ...state,
                cartItems: state.cartItems.map(i =>
                    cartLineId(i) === action.payload.lineId
                        ? { ...i, quantity: action.payload.quantity }
                        : i
                )
            }

        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(i => cartLineId(i) !== action.payload)
            }


        case CLEAR_CART:
            return {
                ...state,
                cartItems: []
            }


        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }


        default:
            return state
    }
}

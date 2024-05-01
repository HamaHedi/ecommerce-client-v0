import {
    ALL_BRANDS_REQUEST,
	CLEAR_ERRORS,
    ALL_BRANDS_SUCCESS,
    ALL_BRANDS_FAIL

} from '../constants/brandConstants'

export const brandsReducer = (state = { brands: [] }, action) => {
	switch (action.type) {
		case ALL_BRANDS_REQUEST:
			return {
				loading: true,
				brands: [],
			}

		case ALL_BRANDS_SUCCESS:
			return {
				loading: false,
				brands: action.payload.brands,
				brandsCount: action.payload.brandsCount,
				resPerPage: action.payload.resPerPage,
				filteredBrandsCount: action.payload.filteredBrandsCount,
			}

	

		case ALL_BRANDS_FAIL:
			return {
				loading: false,
				error: action.payload,
			}

		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			}

		default:
			return state
	}
}


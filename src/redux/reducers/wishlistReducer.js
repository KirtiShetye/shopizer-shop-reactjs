import {
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST
} from '../actions/wishlistActions';

const initState = {
  items: [],
  productIds: [],
  products: [],
  loading: false,
  error: null
};

const wishlistReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_REQUEST:
      return { ...state, loading: true };
    
    case FETCH_WISHLIST_SUCCESS:
      // Backend returns ReadableWishlist with productIds and products arrays
      const wishlistData = action.payload || {};
      return { 
        ...state, 
        loading: false, 
        items: wishlistData.productIds || [],
        productIds: wishlistData.productIds || [],
        products: wishlistData.products || [],
        error: null 
      };
    
    case FETCH_WISHLIST_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    
    case ADD_TO_WISHLIST:
      return state;
    
    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(id => id !== action.payload),
        productIds: state.productIds.filter(id => id !== action.payload),
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case CLEAR_WISHLIST:
      return { ...state, items: [], productIds: [], products: [] };
    
    default:
      return state;
  }
};

export default wishlistReducer;

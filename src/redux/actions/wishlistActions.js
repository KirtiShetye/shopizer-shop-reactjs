import WishlistService from '../../util/wishlistService';

export const FETCH_WISHLIST_REQUEST = 'FETCH_WISHLIST_REQUEST';
export const FETCH_WISHLIST_SUCCESS = 'FETCH_WISHLIST_SUCCESS';
export const FETCH_WISHLIST_FAILURE = 'FETCH_WISHLIST_FAILURE';
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
export const CLEAR_WISHLIST = 'CLEAR_WISHLIST';

export const fetchWishlist = (customerId) => {
  return async dispatch => {
    dispatch({ type: FETCH_WISHLIST_REQUEST });
    try {
      const data = await WishlistService.getWishlist(customerId);
      dispatch({ type: FETCH_WISHLIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_WISHLIST_FAILURE, payload: error.message });
    }
  };
};

export const addToWishlist = (customerId, productId) => {
  return async dispatch => {
    try {
      await WishlistService.addToWishlist(customerId, productId);
      dispatch({ type: ADD_TO_WISHLIST, payload: productId });
      dispatch(fetchWishlist(customerId));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };
};

export const removeFromWishlist = (customerId, productId) => {
  return async dispatch => {
    try {
      await WishlistService.removeFromWishlist(customerId, productId);
      dispatch({ type: REMOVE_FROM_WISHLIST, payload: productId });
      dispatch(fetchWishlist(customerId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };
};

export const clearWishlist = (customerId) => {
  return async dispatch => {
    try {
      await WishlistService.clearWishlist(customerId);
      dispatch({ type: CLEAR_WISHLIST });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  };
};

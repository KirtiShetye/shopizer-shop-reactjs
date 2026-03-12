import WebService from './webService';

export default class WishlistService {
  
  static async getWishlist(customerId, store = 'DEFAULT') {
    const action = `customer/${customerId}/wishlist?store=${store}`;
    return await WebService.get(action);
  }

  static async addToWishlist(customerId, productId, store = 'DEFAULT') {
    const action = `customer/${customerId}/wishlist/product/${productId}?store=${store}`;
    return await WebService.post(action, {});
  }

  static async removeFromWishlist(customerId, productId, store = 'DEFAULT') {
    const action = `customer/${customerId}/wishlist/product/${productId}?store=${store}`;
    return await WebService.delete(action);
  }

  static async getWishlistCount(customerId, store = 'DEFAULT') {
    const action = `customer/${customerId}/wishlist/count?store=${store}`;
    return await WebService.get(action);
  }

  static async clearWishlist(customerId, store = 'DEFAULT') {
    const action = `customer/${customerId}/wishlist?store=${store}`;
    return await WebService.delete(action);
  }
}

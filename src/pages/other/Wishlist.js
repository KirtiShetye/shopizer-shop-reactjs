import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchWishlist, removeFromWishlist, clearWishlist } from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import { isValidObject } from "../../util/helper";
import { multilanguage } from "redux-multilanguage";
import Layout from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Wishlist = ({
  userData,
  wishlistData,
  cartData,
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
  addToCart,
  addToast,
  strings
}) => {
  const history = useHistory();

  useEffect(() => {
    if (!userData || !userData.id) {
      addToast('Please login to view wishlist', { appearance: 'error', autoDismiss: true });
      history.push('/login');
      return;
    }
    fetchWishlist(userData.id);
  }, [userData, fetchWishlist, history, addToast]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userData.id, productId);
      addToast('Product removed from wishlist', { appearance: 'success', autoDismiss: true });
    } catch (error) {
      addToast('Failed to remove product', { appearance: 'error', autoDismiss: true });
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      try {
        await clearWishlist(userData.id);
        addToast('Wishlist cleared', { appearance: 'success', autoDismiss: true });
      } catch (error) {
        addToast('Failed to clear wishlist', { appearance: 'error', autoDismiss: true });
      }
    }
  };

  const handleAddToCart = (product) => {
    const index = isValidObject(cartData.cartItems) 
      ? cartData.cartItems.products.findIndex(cart => cart.id === product.id) 
      : -1;
    
    addToCart(
      product,
      addToast,
      cartData.cartItems.code,
      index === -1 ? 1 : cartData.cartItems.products[index].quantity + 1,
      cartData.defaultStore,
      userData,
      []
    );
  };

  if (wishlistData.loading) {
    return (
      <Layout>
        <Breadcrumb title="Wishlist" />
        <div className="wishlist-area pt-95 pb-100">
          <div className="container">
            <div className="text-center">
              <p>Loading wishlist...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!wishlistData.products || wishlistData.products.length === 0) {
    return (
      <Layout>
        <Breadcrumb title="Wishlist" />
        <div className="wishlist-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="wishlist-empty text-center">
                  <i className="pe-7s-like" style={{ fontSize: '80px', color: '#ccc' }}></i>
                  <h2 style={{ marginTop: '20px' }}>Your Wishlist is Empty</h2>
                  <p style={{ color: '#666', marginBottom: '30px' }}>Save your favorite products here</p>
                  <Link to="/category/all" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumb title="Wishlist" />
      <div className="wishlist-area pt-95 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="wishlist-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid #eee'
              }}>
                <h3>My Wishlist ({wishlistData.products.length} items)</h3>
                <button 
                  className="btn btn-danger"
                  onClick={handleClearAll}
                  style={{ padding: '10px 20px' }}
                >
                  Clear All
                </button>
              </div>

              <div className="wishlist-items">
                {wishlistData.products.map((product, index) => (
                  <div key={index} className="wishlist-item" style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '20px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    transition: 'box-shadow 0.3s'
                  }}>
                    <div className="item-image" style={{ flexShrink: 0, width: '150px', height: '150px' }}>
                      <Link to={`/product/${product.id}`}>
                        <img 
                          src={product.image?.imageUrl || '/assets/img/product/placeholder.png'} 
                          alt={product.description?.name || 'Product'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Link>
                    </div>
                    
                    <div className="item-details" style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                        <Link to={`/product/${product.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                          {product.description?.name || 'Product Name'}
                        </Link>
                      </h4>
                      <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                        {product.description?.description?.substring(0, 100) || ''}...
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                          {product.productPrice || product.price || '$0.00'}
                        </span>
                        {product.available ? (
                          <span style={{ color: '#27ae60', fontWeight: '500', fontSize: '14px' }}>In Stock</span>
                        ) : (
                          <span style={{ color: '#e74c3c', fontWeight: '500', fontSize: '14px' }}>Out of Stock</span>
                        )}
                      </div>
                    </div>

                    <div className="item-actions" style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      justifyContent: 'center'
                    }}>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.available}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          opacity: product.available ? 1 : 0.5,
                          cursor: product.available ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleRemove(product.id)}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          color: '#e74c3c',
                          border: '1px solid #e74c3c'
                        }}
                      >
                        <i className="fa fa-trash" style={{ marginRight: '5px' }}></i>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    wishlistData: state.wishlistData,
    cartData: state.cartData,
    defaultStore: state.merchantData.defaultStore
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWishlist: (customerId) => dispatch(fetchWishlist(customerId)),
    removeFromWishlist: (customerId, productId) => dispatch(removeFromWishlist(customerId, productId)),
    clearWishlist: (customerId) => dispatch(clearWishlist(customerId)),
    addToCart: (item, addToast, cartCode, quantity, defaultStore, userData, options) => {
      dispatch(addToCart(item, addToast, cartCode, quantity, defaultStore, userData, options));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(Wishlist));

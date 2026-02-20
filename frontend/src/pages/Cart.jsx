import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      setLoading(false);
      return;
    }

    try {
      const r = await api.get(`/carts/${cartId}/`);
      setCart(r.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.post(`/carts/${cart.id}/items/`, { product_id: productId, quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error("Update failed");
    }
  };

  const removeItem = async (itemId) => {
    // 1. Optimistic Update: Remove from UI immediately
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    setCart({ ...cart, items: updatedItems });

    try {
      // 2. Perform actual deletion
      await api.delete(`/carts/${cart.id}/items/${itemId}/`);
      
      // 3. Optional: refresh from server to ensure sync
      fetchCart();
      
      // Add a toast if you're using react-hot-toast now
      // toast.success("Item removed"); 
    } catch (err) {
      console.error("Remove failed");
      alert("Failed to remove item. Reverting...");
      fetchCart(); // Revert to server state if API fails
    }
  };


  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('Please sign in to complete your secure payment.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create the Order in your database (Converts Cart to Order)
      const orderRes = await api.post(`/carts/${cart.id}/checkout/`);
      const orderId = orderRes.data.id;

      // 2. Request a Stripe Checkout Session from your backend
      // We pass the order_id so Stripe can reference it in webhooks
      const stripeRes = await api.post('/payments/create-checkout-session/', {
        order_id: orderId
      });

      // 3. Redirect to Stripe's Secure Payment Page
      if (stripeRes.data.checkout_url) {
        // We don't clear the cart here yet; we do it on the Success Page
        window.location.href = stripeRes.data.checkout_url;
      } else {
        throw new Error("Could not initialize Stripe session");
      }
      
    } catch (err) {
      const msg = err.response?.data?.detail || "Checkout unavailable. Try again.";
      alert(msg);
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 bg-white rounded-4 border shadow-sm">
          <span className="fs-1 d-block mb-3">🛒</span>
          <h2 className="fw-bold mb-3">Your bag is empty</h2>
          <p className="text-muted mb-4">Add some items to start your shopping journey.</p>
          <Link to="/" className="btn btn-dark btn-lg rounded-pill px-5">Browse Products</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Main List */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <span className="fs-3 me-2">🛒</span>
            <h2 className="fw-bold m-0">Your Bag</h2>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase fw-bold text-muted">
                    <th className="ps-4 py-3 border-0">Product</th>
                    <th className="text-center py-3 border-0">Quantity</th>
                    <th className="text-end pe-4 py-3 border-0">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((it) => (
                    <tr key={it.id} className="border-bottom">
                      <td className="ps-4 py-4 border-0">
                        <div className="d-flex align-items-center">
                          <img 
                            src={it.product.image_url ? `${API_BASE_URL}${it.product.image_url}` : 'https://via.placeholder.com'} 
                            alt={it.product.name}
                            className="rounded-3 me-3 border shadow-sm"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-dark mb-1">{it.product.name}</div>
                            <div className="text-muted small mb-2">${it.product.price.toFixed(2)}</div>
                            <button 
                              className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                              onClick={() => removeItem(it.id)}
                            >
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 border-0 text-center">
                        <div className="d-flex justify-content-center">
                          <div className="input-group input-group-sm shadow-sm" style={{ width: '110px' }}>
                            <button className="btn btn-light border" onClick={() => updateQuantity(it.product.id, it.quantity - 1)}>−</button>
                            <span className="form-control text-center bg-white border fw-bold">{it.quantity}</span>
                            <button className="btn btn-light border" onClick={() => updateQuantity(it.product.id, it.quantity + 1)}>+</button>
                          </div>
                        </div>
                      </td>

                      <td className="pe-4 py-4 text-end fw-bold fs-5 border-0">
                        ${(it.product.price * it.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: '110px' }}>
            <h5 className="fw-bold mb-4">Summary</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Item Subtotal</span>
              <span className="fw-semibold">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
              <span className="text-muted">Shipping</span>
              <span className="text-success fw-bold small">FREE</span>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <span className="h5 fw-bold">Total</span>
              <span className="h4 fw-bold text-primary">${subtotal.toFixed(2)}</span>
            </div>

            {isLoggedIn ? (
              <button 
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow transition" 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <span>Checkout with <strong className="ms-1">Stripe</strong></span>
                )}
              </button>
            ) : (
              <div className="text-center p-3 bg-light rounded-3">
                <p className="small text-muted mb-3 italic">Please sign in to proceed to secure checkout.</p>
                <button 
                  className="btn btn-dark w-100 rounded-pill fw-bold" 
                  onClick={() => navigate('/login')}
                >
                  Sign In to Pay
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-top text-center text-muted">
              <span className="small">🛡️ Secure SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


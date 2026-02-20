import React, { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

// Use Vite environment variable for images; relative paths handled by Axios 'api' instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const perPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Added trailing slash to match FastAPI strict routing
      const res = await api.get(`/products/`, { 
        params: { q: query || undefined, page, per_page: perPage } 
      });
      // Safety check: ensure we always have an array
      setProducts(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error("Failed to load products. Check your connection.");
      setProducts([]); // Fallback to empty array on error to prevent .map crashes
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const getOrCreateCart = async () => {
    let cartId = localStorage.getItem("cart_id");
    if (cartId) {
      try {
        await api.get(`/carts/${cartId}/`);
        return cartId;
      } catch {
        localStorage.removeItem("cart_id");
      }
    }
    const r = await api.post(`/carts/`);
    localStorage.setItem("cart_id", r.data.id);
    return r.data.id;
  };

  const addToCart = async (productId) => {
    const performAdd = async () => {
      const cartId = await getOrCreateCart();
      return api.post(`/carts/${cartId}/items/`, { 
        product_id: productId, 
        quantity: 1 
      });
    };

    toast.promise(performAdd(), {
      loading: 'Adding to bag...',
      success: <b>Added to cart! 🛒</b>,
      error: <b>Could not add item.</b>,
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="container py-5">
      {/* Search Header Section */}
      <div className="row mb-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h2 className="fw-bold mb-4">Our Collection</h2>
          <form className="input-group shadow-sm rounded-pill overflow-hidden border bg-white" onSubmit={onSearch}>
            <input 
              className="form-control border-0 px-4 py-2 shadow-none" 
              placeholder="Search products..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
            <button className="btn btn-primary px-4 fw-bold shadow-none">Search</button>
          </form>
        </div>
      </div>

      {/* Conditional Rendering: Loading vs Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Fetching products...</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="row g-4">
            {products?.length > 0 ? (
              products.map((p) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all product-card">
                    {/* Image Container with Fallback */}
                    <div style={{ height: '240px', backgroundColor: '#f9f9f9' }}>
                      <img 
                        src={p.image_url ? `${API_BASE_URL}${p.image_url}` : 'https://via.placeholder.com'} 
                        alt={p.name}
                        className="card-img-top h-100 w-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between p-4 text-center">
                      <div>
                        <h6 className="card-title mb-1 text-dark fw-bold text-uppercase small">{p.name}</h6>
                        <p className="text-primary fs-5 fw-bold mb-3">${p.price.toFixed(2)}</p>
                      </div>
                      <button 
                        className="btn btn-dark w-100 rounded-pill py-2 fw-bold shadow-sm"
                        onClick={() => addToCart(p.id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="fs-4 text-muted">No products found for "{query}"</p>
                <button className="btn btn-link text-primary" onClick={() => {setQuery(''); setPage(1); fetchProducts();}}>Clear search</button>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4 border-top border-light">
            <div className="text-muted small mb-3 mb-md-0">
              Showing <span className="fw-bold">{products?.length || 0}</span> of {total} products
            </div>

            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                  <button className="page-link rounded-start-pill px-3 shadow-none" onClick={() => setPage(p => p - 1)}>Prev</button>
                </li>
                <li className="page-item active">
                  <span className="page-link px-4">{page}</span>
                </li>
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                  <button className="page-link rounded-end-pill px-3 shadow-none" onClick={() => setPage(p => p + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Subtle CSS for hover effects */}
      <style>{`
        .product-card { transition: all 0.3s ease; }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important; }
        .pagination .page-link { color: #333; border: none; background: #f8f9fa; margin: 0 2px; }
        .pagination .active .page-link { background-color: #0d6efd; color: white; }
      `}</style>
    </div>
  );
}

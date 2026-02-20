import React from 'react';
import { Link } from 'react-router-dom';

export default function CancelPage() {
  return (
    <div className="container py-5 text-center">
      <div className="card border-0 shadow-sm p-5 rounded-4 bg-white mx-auto" style={{maxWidth: '500px'}}>
        <span className="fs-1 d-block mb-3">🛒</span>
        <h2 className="fw-bold mb-3">Payment Cancelled</h2>
        <p className="text-muted mb-4">
          Your order was not processed and no charges were made. 
          Your items are still waiting in your cart!
        </p>
        <div className="d-grid gap-2">
          <Link to="/cart" className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm">
            Return to My Cart
          </Link>
          <Link to="/" className="btn btn-link text-muted text-decoration-none small">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

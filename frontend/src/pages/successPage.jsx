// src/pages/SuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Clear cart locally as payment is confirmed
      localStorage.removeItem('cart_id');
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="container py-5 text-center">
      <div className="card border-0 shadow-sm p-5 rounded-4 bg-white mx-auto" style={{maxWidth: '500px'}}>
        <span className="fs-1 d-block mb-3">✅</span>
        <h2 className="fw-bold mb-3">Payment Successful!</h2>
        <p className="text-muted mb-4">Thank you for your purchase. Your order is now being processed.</p>
        <Link to="/" className="btn btn-primary btn-lg rounded-pill px-5 shadow">Continue Shopping</Link>
      </div>
    </div>
  );
}

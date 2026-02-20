import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductList from './components/ProductList'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import CartPage from './pages/Cart'
import SuccessPage from './pages/successPage'
import CancelPage from './pages/cancelPage'
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
       <Toaster position="top-center" />
      <div className="container py-4">
  
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

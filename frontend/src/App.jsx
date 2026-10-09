import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ArrowRight } from 'lucide-react';

function NotFound() {
  return (
    <div className="container empty-state page-empty">
      <h2>That page wandered off.</h2>
      <p>Let’s get you back to the good stuff.</p>
      <Link to="/" className="button button-saffron">
        <span>Back home</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main className="page-wrap">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}

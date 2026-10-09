import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function ProtectedRoute({ children }) {
  const { user, token } = useShop();
  const location = useLocation();

  // If no token exists in context or localStorage, redirect to login
  const hasToken = token || localStorage.getItem('shopkart_token');

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

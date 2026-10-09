import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shopkart_token'));
  const [cart, setCart] = useState({
    items: [],
    savedItems: [],
    subtotal: 0,
    deliveryCharges: 0,
    demoSavings: 0,
    total: 0,
    count: 0
  });
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState('');
  const [categories, setCategories] = useState([]);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch categories once
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const loadCart = useCallback(async () => {
    if (!localStorage.getItem('shopkart_token')) return;
    try {
      const res = await api.get('/cart');
      if (res.data) setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!localStorage.getItem('shopkart_token')) return;
    try {
      const [itemsRes, idsRes] = await Promise.all([
        api.get('/wishlist'),
        api.get('/wishlist/ids')
      ]);
      if (itemsRes.data) setWishlist(itemsRes.data);
      if (idsRes.data) setWishlistIds(idsRes.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!localStorage.getItem('shopkart_token')) return;
    try {
      const res = await api.get('/orders');
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, []);

  // Check auth & load data on mount or token change
  useEffect(() => {
    const currentToken = localStorage.getItem('shopkart_token');
    if (currentToken) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          loadCart();
          loadWishlist();
          loadOrders();
        })
        .catch(() => {
          localStorage.removeItem('shopkart_token');
          setUser(null);
          setToken(null);
        });
    } else {
      // Auto-login demo account if none to guarantee smooth demo out of the box
      api.post('/auth/login', { email: 'demo@shopkart.test', password: 'shopkart' })
        .then((res) => {
          if (res.data?.token) {
            localStorage.setItem('shopkart_token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            loadCart();
            loadWishlist();
            loadOrders();
          }
        })
        .catch(() => {});
    }
  }, [loadCart, loadWishlist, loadOrders]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('shopkart_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      showToast('Welcome back to ShopKart');
      loadCart();
      loadWishlist();
      loadOrders();
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.token) {
      localStorage.setItem('shopkart_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      showToast('Your demo account is ready');
      loadCart();
      loadWishlist();
      loadOrders();
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('shopkart_token');
    setToken(null);
    setUser(null);
    setCart({ items: [], savedItems: [], subtotal: 0, deliveryCharges: 0, demoSavings: 0, total: 0, count: 0 });
    setWishlist([]);
    setWishlistIds([]);
    setOrders([]);
    showToast('Signed out of demo account');
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await api.post('/cart/add', { productId: product.id, quantity });
      if (res.data) setCart(res.data);
      showToast(`${product.title} added to cart`);
    } catch (err) {
      showToast(err.message);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}`, { quantity });
      if (res.data) setCart(res.data);
    } catch (err) {
      showToast(err.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/${cartItemId}`);
      if (res.data) setCart(res.data);
      showToast('Item removed from cart');
    } catch (err) {
      showToast(err.message);
    }
  };

  const saveForLater = async (cartItemId) => {
    try {
      const res = await api.post(`/cart/save-for-later/${cartItemId}`);
      if (res.data) setCart(res.data);
      showToast('Saved for later');
    } catch (err) {
      showToast(err.message);
    }
  };

  const moveToCart = async (savedItemId) => {
    try {
      const res = await api.post(`/cart/move-to-cart/${savedItemId}`);
      if (res.data) setCart(res.data);
      showToast('Moved to cart');
    } catch (err) {
      showToast(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      if (res.data) setCart(res.data);
    } catch (err) {
      showToast(err.message);
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const res = await api.post(`/wishlist/toggle/${product.id}`);
      showToast(res.message || 'Updated wishlist');
      loadWishlist();
    } catch (err) {
      showToast(err.message);
    }
  };

  const placeOrder = async (orderData) => {
    const res = await api.post('/orders', orderData);
    showToast('Demo order placed successfully');
    loadCart();
    loadOrders();
    return res.data;
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      showToast('Demo order cancelled');
      loadOrders();
      return res.data;
    } catch (err) {
      showToast(err.message);
    }
  };

  const buyAgain = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/buy-again`);
      showToast('Items added back to cart');
      loadCart();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        categories,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCart,
        clearCart,
        wishlist,
        wishlistIds,
        toggleWishlist,
        orders,
        loadOrders,
        placeOrder,
        cancelOrder,
        buyAgain,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

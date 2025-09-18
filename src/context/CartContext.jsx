import React, { createContext, useState, useEffect } from 'react';
import {
  getCart,
  updateCart,
  removeFromCart,
} from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Load cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        if (data.error && data.unauthorized) {
          // ✅ Session expired - redirect to login
          console.warn('[Cart] Session expired, redirecting to login');
          window.location.href = '/login';
          return;
        }
        setCartItems(data.items || []);
        console.log('[Cart] Loaded from backend:', data.items);
      } catch (err) {
        console.error('[Cart] ❌ Failed to load cart:', err);
      }
    };
    fetchCart();
  }, []);

  // 🔁 Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity < 1) return;

    try {
      const updated = await updateCart(productId, newQuantity);
      if (updated.error && updated.unauthorized) {
        // ✅ Session expired - redirect to login
        console.warn('[Cart] Session expired during update, redirecting to login');
        window.location.href = '/login';
        return;
      }
      setCartItems(updated.items || []);
      console.log('[Cart] ✅ Quantity updated');
    } catch (err) {
      console.error('[Cart] ❌ Failed to update quantity:', err);
    }
  };

  // ❌ Remove from cart
  const removeItem = async (productId) => {
    if (!productId) return;

    try {
      const updated = await removeFromCart(productId);
      if (updated.error && updated.unauthorized) {
        // ✅ Session expired - redirect to login
        console.warn('[Cart] Session expired during remove, redirecting to login');
        window.location.href = '/login';
        return;
      }
      setCartItems(updated.items || []);
      console.log('[Cart] ✅ Item removed');
    } catch (err) {
      console.error('[Cart] ❌ Failed to remove item:', err);
    }
  };

  // ➕ Add to cart or increase quantity
  const addToCart = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) {
      console.error('[addToCart] ❌ Invalid product:', product);
      return;
    }

    const existing = cartItems.find(
      (item) => item?.productId?._id === productId
    );

    const newQuantity = existing ? existing.quantity + 1 : 1;

    try {
      const updated = await updateCart(productId, newQuantity);
      if (updated.error && updated.unauthorized) {
        // ✅ Session expired - redirect to login
        console.warn('[Cart] Session expired during add, redirecting to login');
        window.location.href = '/login';
        return;
      }
      setCartItems(updated.items || []);
      console.log('[Cart] ✅ Product added/updated');
    } catch (err) {
      console.error('[Cart] ❌ Failed to add/update:', err);
    }
  };

  // ✅ Check before adding
  const checkAndAddToCart = async (product) => {
    const productId = product?._id || product?.id;
    const exists = cartItems.some(
      (item) => item?.productId?._id === productId
    );

    if (!exists) {
      console.log('[Cart] Item not in cart. Adding...');
      await addToCart(product);
    } else {
      console.log('[Cart] Item already in cart. Skipping...');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        updateQuantity,
        removeItem,
        addToCart,
        checkAndAddToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// src/services/cartService.js
import API from '../api';

// 🚚 GET cart items
export const getCart = async () => {
  try {
    const res = await API.get('/cart');
    return res.data;
  } catch (err) {
    console.error('[getCart] ❌', err);
    return { error: 'Could not load cart' };
  }
};

// 🔁 POST/UPDATE cart item
export const updateCart = async (productId, quantity) => {
  if (!productId) {
    console.error('[updateCart] ❌ Missing productId');
    return { error: 'Missing productId' };
  }

  try {
    const res = await API.post('/cart', { productId, quantity });
    return res.data;
  } catch (err) {
    console.error('[updateCart] ❌', err);
    return { error: 'Could not update cart' };
  }
};

// ❌ DELETE cart item
export const removeFromCart = async (productId) => {
  if (!productId) {
    console.error('[removeFromCart] ❌ Missing productId');
    return { error: 'Missing productId' };
  }

  try {
    const res = await API.delete(`/cart/${productId}`);
    return res.data;
  } catch (err) {
    console.error('[removeFromCart] ❌', err);
    return { error: 'Could not remove item from cart' };
  }
};

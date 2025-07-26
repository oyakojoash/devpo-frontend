// src/services/cartService.js

// 🚚 GET cart items
export const getCart = async () => {
  try {
    const res = await fetch('/api/cart', { credentials: 'include' });

    if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
    return await res.json();
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

  console.log('[updateCart] ✅ Sending:', { productId, quantity });

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) throw new Error(`Failed to update cart: ${res.status}`);
    return await res.json();
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

  console.log('[removeFromCart] ✅ Deleting:', productId);

  try {
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) throw new Error(`Failed to remove item: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[removeFromCart] ❌', err);
    return { error: 'Could not remove item from cart' };
  }
};

// services/cartService.js
export const getCart = async () => {
  const res = await fetch('/api/cart', { credentials: 'include' });
  return res.json();
};

export const updateCart = async (productId, quantity) => {
  const res = await fetch('/api/cart', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
};

export const removeFromCart = async (productId) => {
  const res = await fetch(`/api/cart/${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
};

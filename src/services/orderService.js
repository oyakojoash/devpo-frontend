// src/services/orderService.js

export const fetchOrderById = async (id) => {
  const res = await fetch(`/api/orders/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
};

export const cancelOrder = async (id) => {
  const res = await fetch(`/api/orders/${id}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to cancel order');
  return res.json();
};

// ✅ ADD THIS
export const getUserOrders = async () => {
  const res = await fetch('/api/orders/my-orders', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return res.json();
};

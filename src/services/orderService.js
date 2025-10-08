// src/services/orderService.js
import API from '../api';

// ✅ Place a new order
export const placeOrder = async (orderData) => {
  try {
    const res = await API.post('/api/orders', orderData);
    return res.data;
  } catch (err) {
    console.error('[placeOrder] ❌', err);
    return { error: 'Failed to place order' };
  }
};

// ✅ Fetch a single order by ID
export const fetchOrderById = async (id) => {
  try {
    const res = await API.get(`/api/orders/${id}`);
    return res.data;
  } catch (err) {
    console.error('[fetchOrderById] ❌', err);
    return { error: 'Failed to fetch order' };
  }
};

// ✅ Cancel an order by ID
export const cancelOrder = async (id) => {
  try {
    const res = await API.patch(`/api/orders/${id}/cancel`);
    return res.data;
  } catch (err) {
    console.error('[cancelOrder] ❌', err);
    return { error: 'Failed to cancel order' };
  }
};

// ✅ Get all orders of logged-in user
export const getUserOrders = async () => {
  try {
    const res = await API.get('/api/orders/my-orders');
    return res.data;
  } catch (err) {
    console.error('[getUserOrders] ❌', err);
    return { error: 'Failed to fetch user orders' };
  }
};

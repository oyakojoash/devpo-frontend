import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api'; // ✅ Use your Axios instance
import './AccountOrdersPage.css';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // ✅ Fetch orders directly from your backend using your API instance
        const response = await API.get('/api/orders/my-orders');
        setOrders(response.data); // assuming backend returns an array of orders
      } catch (err) {
        console.error('Failed to load orders:', err);
        alert('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p className="orders-loading">Loading your orders...</p>;
  if (orders.length === 0) return <p className="orders-empty">You have no past orders.</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Status:</strong> {order.status}</span>
              <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <ul className="order-items">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  {p.productId?.name ?? 'Product'} x {p.quantity} — ${p.productId?.price?.toFixed(2) ?? 'N/A'}
                </li>
              ))}
            </ul>

            <Link to={`/account/orders/${order._id}`} className="view-details-link">
              View Details
            </Link>

            <div className="order-total">
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

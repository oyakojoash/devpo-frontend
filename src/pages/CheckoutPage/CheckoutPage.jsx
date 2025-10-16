

import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ New state for user info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Prepare products
  const products = cartItems.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    quantity: item.quantity,
  }));

  // Calculate total price
  const totalPrice = products.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!name) {
      alert('Name is required');
      return;
    }
    if (cartItems.length === 0) return;

    const orderData = {
      products,
      totalPrice,
      userInfo: { name, email, phone }, // ✅ include userInfo
    };

    try {
      setLoading(true);
      const result = await placeOrder(orderData);
      
      if (result.error) {
        console.error('❌ Order placement failed:', result.error);
        alert('Failed to place order.');
      } else {
        console.log('✅ Order placed:', result);
        clearCart();
        navigate('/account/orders');
      }
    } catch (err) {
      console.error('❌ Order placement error:', err);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {/* User Info Form */}
      <div className="user-info-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <ul className="checkout-items">
        {cartItems.map(item => (
          <li key={item._id || item.id}>
            {item.productId.name} x{item.quantity} = $
            {((item.productId.price ?? 0) * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <h3>Total: ${totalPrice.toFixed(2)}</h3>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

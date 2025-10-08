import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // ✅ Use your custom API instance
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Calculate total
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.price ?? 0) * item.quantity,
    0
  );

  // ✅ Handle place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    // Prepare order data
    const products = cartItems.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity,
    }));

    try {
      setLoading(true);

      // ✅ Send the order to your backend using your API instance
      await API.post('/api/orders', { products, totalAmount });

      clearCart();
      navigate('/account/orders');
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <ul className="checkout-items">
        {cartItems.map(item => (
          <li key={item._id || item.id}>
            {item.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <h3>Total: ${totalAmount.toFixed(2)}</h3>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

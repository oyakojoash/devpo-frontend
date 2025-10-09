import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService'; // ✅ Import from your orderService
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

    // ✅ Prepare simplified order data (proof of concept)
    const products = cartItems.map(item => ({
  productId: item._id || item.id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
}));

const totalPrice = cartItems.reduce(
  (sum, item) => sum + (item.price ?? 0) * item.quantity,
  0
);

const result = await placeOrder({ products, totalPrice });


    try {
      setLoading(true);

      // ✅ Use your service abstraction instead of direct API call
      const result = await placeOrder({ products, totalAmount });

      if (result.error) {
        console.error('❌ Order placement failed:', result.error);
        alert('Failed to place order.');
      } else {
        console.log('✅ Order placed:', result);
        clearCart();
        navigate('/account/orders');
      }
      console.log('Cart Items:', cartItems);


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

      <ul className="checkout-items">
        {cartItems.map(item => (
          <li key={item._id || item.id}>
            {item.name} x{item.quantity} = $
            {(item.price * item.quantity).toFixed(2)}
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
      
      <h3>console.log('Cart Items:', cartItems);
</h3>

    </div>
  );
}

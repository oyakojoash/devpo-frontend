import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Prepare products with correct name and price
  const products = cartItems.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    quantity: item.quantity,
  }));

  // ✅ Calculate total price
  const totalPrice = products.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );
  const orderData = {
  products,      // array of product objects
  totalPrice,    // total order price
};

  // ✅ Handle place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

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
      console.log('Cart Items:', cartItems);
       console.log(':totalPrice', totalPrice);

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

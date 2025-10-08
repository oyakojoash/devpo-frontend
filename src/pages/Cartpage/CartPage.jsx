import React, { useContext } from 'react';
import Cart from '../../components/cart/Cart';
import './CartPage.css';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';


export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

const goToCheckout = () => {
  navigate('/checkout');
};
<button onClick={goToCheckout} className="make-order-btn">
  Make an Order
</button>


  return (
    <div className="cart-page">
      <Cart
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
}

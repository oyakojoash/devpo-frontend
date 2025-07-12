import React from "react";
import PropTypes from "prop-types";
import "./Cart.css";

/* ---------- small pure helpers ---------- */

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatPrice(value) {
  return safeNumber(value).toFixed(2);
}

/* ---------- the Cart component ---------- */

export default function Cart({ cartItems, updateQuantity, removeItem }) {
  // normal function, fully guarded
  function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

function getTotal() {
  const total = cartItems.reduce(
    (sum, item) =>
      sum + safeNumber(item.price) * safeNumber(item.quantity, 1),
    0
  );
  return total.toFixed(2); // e.g., "59.97"
}


  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div>
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">${formatPrice(item.price)}</p>
                </div>
              </div>

              <div className="cart-item-actions">
                <button
                  className="reduce-button"
                  onClick={() =>
                    updateQuantity(item.id, safeNumber(item.quantity, 1) - 1)
                  }
                  disabled={safeNumber(item.quantity, 1) <= 1}
                >
                  reduce
                </button>

                <span>{safeNumber(item.quantity, 1)}</span>

                <button
                  className="add-button"
                  onClick={() =>
                    updateQuantity(item.id, safeNumber(item.quantity, 1) + 1)
                  }
                >
                  add
                </button>

                <button
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">Total: ${getTotal()}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- PropTypes (optional but helpful) ---------- */

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      quantity: PropTypes.number,
      image: PropTypes.string,
    })
  ).isRequired,
  updateQuantity: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

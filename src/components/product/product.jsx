import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './product.css';
import { vendors } from '../../data/vendors';
import { CartContext } from '../../context/CartContext';

export default function Product({ id, name, price, image, vendorId }) {
  const vendor = vendors.find((v) => v.id === vendorId);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // 👈 Get from context

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = () => {
    addToCart({ id, name, price, image }); // 👈 Send product info
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleCardClick();
      }}
    >
      <img
        src={image}
        alt={name}
        className="product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'http://localhost:5000/images/fallback-logo.png';
        }}
      />
      <h3 className="product-name">{name}</h3>
      <p className="product-price">${Number(price).toFixed(2)}</p>

      {vendor && (
        <Link
          to={`/vendor/${vendor.id}`}
          className="vendor-link"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vendor-info">
            <img
              src={`http://localhost:5000/images/vendors/${vendor.logo}`}
              alt={vendor.name}
              className="vendor-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/images/fallback-logo.png';
              }}
            />
            <span>{vendor.name}</span>
          </div>
        </Link>
      )}

      <button
        className="add-to-cart-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart();
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

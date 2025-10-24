import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './product.css';
import { vendors } from '../../data/vendors';
import { CartContext } from '../../context/CartContext';
import API, { API_BASE_URL } from '../../api/api';
import ProductAPI, { PRODUCT_API_BASE_URL } from '../../api/productApi';

export default function Product({ _id, name, price, image, vendorId, description }) {
  const vendor = vendors.find((v) => v.id === vendorId);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleCardClick = () => navigate(`/products/${_id}`);
  const handleAddToCart = () => addToCart({ _id, name, price, image });

  // Helper to build image URLs with fallback
  const getImageSrc = (path, fallbackPath) => {
    return `${PRODUCT_API_BASE_URL}${path}`;
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
      {/* Product Image */}
      <img
        src={`${PRODUCT_API_BASE_URL}/api/images/${image}`}
        alt={name}
        className="product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${API_BASE_URL}/api/images/${image}`;
        }}
      />

      {/* Vendor */}
      {vendor && (
        <Link
          to={`/vendor/${vendor.id}`}
          className="vendor-link"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vendor-info">
            <img
              src={`${PRODUCT_API_BASE_URL}/images/${vendor.logo}`}
              alt={vendor.name}
              className="vendor-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_BASE_URL}/images/vendors/${vendor.logo}`;
              }}
            />
            <span>{vendor.name}</span>
          </div>
        </Link>
      )}

      {/* Product Name & Price */}
      <h3 className="product-name">{name}</h3>
      <p className="product-price">ksh {Number(price).toFixed(2)}</p>

      {/* Short Description */}
      {description && (
        <p className="product-details">
          {description.length > 80 ? description.slice(0, 80) + '…' : description}
        </p>
      )}

      {/* Add to Cart Button */}
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

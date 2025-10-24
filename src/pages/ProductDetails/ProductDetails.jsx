import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import { vendors } from '../../data/vendors';
import { CartContext } from '../../context/CartContext';
import API, { API_BASE_URL } from '../../api/api'
import ProductAPI, { PRODUCT_API_BASE_URL } from '../../api/productApi';

export default function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Try Product API first
        const res = await ProductAPI.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (productErr) {
        console.warn('Product API failed, trying central API...', productErr.message);
        try {
          // Fallback to central API
          const res = await API.get(`/api/products/${id}`);
          setProduct(res.data);
        } catch (centralErr) {
          console.error('Both APIs failed:', centralErr);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  const vendor = vendors.find(v => v.id === product.vendorId);

  const handleAddToCart = () => addToCart(product);

  return (
    <div className="product-details-page">
      {/* ✅ Product Image with redundancy */}
      <img
        src={PRODUCT_API_BASE_URL ? `${PRODUCT_API_BASE_URL}/api/images/${product.image}` : `${API_BASE_URL}/api/images/${product.image}`}
        alt={product.name}
        className="product-details-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${API_BASE_URL}/api/images/${product.image}`;
        }}
      />

      <div className="product-details-info">
        <h2>{product.name}</h2>
        <p className="product-details-price">ksh{Number(product.price).toFixed(2)}</p>

        {vendor && (
          <div className="vendor-info">
            <img
              src={PRODUCT_API_BASE_URL ? `${PRODUCT_API_BASE_URL}/images/vendors/${vendor.logo}` : `${API_BASE_URL}/images/vendors/${vendor.logo}`}
              alt={vendor.name}
              className="vendor-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_BASE_URL}/images/vendors/${vendor.logo}`;
              }}
            />
            <span>Sold by: {vendor.name}</span>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

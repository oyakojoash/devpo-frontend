import React, { useState, useEffect, useContext } from 'react';
import Product from '../../components/product/product';
import './ProductsPage.css';
import { CartContext } from '../../context/CartContext';

export default function ProductsPage({ searchTerm }) {
  const PRODUCTS_PER_PAGE = 20;
  const { addToCart } = useContext(CartContext); // ✅ use context instead of props

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(
          `http://localhost:5000/api/products?search=${encodeURIComponent(
            searchTerm
          )}&page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Server error');
        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching products:', err);
          setError('⚠️ Failed to load products. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [searchTerm, currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="products-page">
      {loading && <p>⏳ Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="no-products">No products found. Try a different search term.</p>
      )}

      <div className="product-list">
        {products
          .filter(product => product.name && product.price)
          .map((product) => (
            <Product
              key={product._id}
              name={product.name}
              price={product.price}
              image={
                product.image
                  ? `http://localhost:5000/images/${product.image}`
                  : 'http://localhost:5000/images/fallback-product.jpeg'
              }
              vendorId={product.vendorId}
              onAddToCart={() => addToCart(product)} // ✅ now safe
            />
          ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}

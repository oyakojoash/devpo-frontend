import React, { useState, useEffect, useContext } from 'react';
import Product from '../../components/product/product';
import './ProductsPage.css';
import { CartContext } from '../../context/CartContext';
import API from '../../api'; // ✅ Axios instance

export default function ProductsPage({ searchTerm }) {
  const PRODUCTS_PER_PAGE = 20;
  const { addToCart } = useContext(CartContext);

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
        const res = await API.get('/products', {
          params: {
            search: searchTerm,
            page: currentPage,
            limit: PRODUCTS_PER_PAGE,
          },
          signal: controller.signal,
        });

        const data = res.data;

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setError('⚠️ Failed to load products. Please try again later.');
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
      {loading && <p className="loading-message">⏳ Loading products...</p>}
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
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              vendorId={product.vendorId}
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

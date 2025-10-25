// src/pages/ProductsPage/ProductsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import Product from "../../components/product/product";
import "./ProductsPage.css";
import { CartContext } from "../../context/CartContext";
import API from "../../api/api"; // Central API
import ProductAPI from "../../api/productApi"; // Product API (primary for products)

export default function ProductsPage({ searchTerm }) {
  const PRODUCTS_PER_PAGE = 20;
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        console.log("📡 Fetching products from Product API...");
        const res = await ProductAPI.get("/api/products", {
          params: {
            search: searchTerm || "",
            page: currentPage,
            limit: PRODUCTS_PER_PAGE,
          },
          signal: controller.signal,
        });

        const { products = [], totalPages = 1 } = res.data;
        console.log("✅ Product API responded with", products.length, "items");
        setProducts(products);
        setTotalPages(totalPages);
      } catch (productErr) {
        if (productErr.name === "CanceledError" || productErr.name === "AbortError") return;

        console.warn(
          "[ProductsPage] ⚠️ Product API failed, trying Central API...",
          productErr.message
        );

        try {
          const res = await API.get("/api/products", {
            params: {
              search: searchTerm || "",
              page: currentPage,
              limit: PRODUCTS_PER_PAGE,
            },
            signal: controller.signal,
          });

          const { products = [], totalPages = 1 } = res.data;
          console.log("✅ Central API responded with", products.length, "items");
          setProducts(products);
          setTotalPages(totalPages);
        } catch (centralErr) {
          if (centralErr.name === "CanceledError" || centralErr.name === "AbortError") return;
          console.error("[ProductsPage] ❌ Both APIs failed:", centralErr);
          setError("⚠️ Failed to load products from both Product and Central APIs.");
        }
      } finally {
        setLoading(false);
      }
    }

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
          .filter((p) => p.name && p.price != null)
          .map((product) => (
            <Product
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              vendorId={product.vendorId}
              addToCart={addToCart}
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
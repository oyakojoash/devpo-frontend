// src/api/productApi.js
import axios from "axios";

export const PRODUCT_API_BASE_URL =
  process.env.REACT_APP_PRODUCT_API_BASE_URL || "http://localhost:10002";

console.log("🌍 Product API Base URL:", PRODUCT_API_BASE_URL);

const ProductAPI = axios.create({
  baseURL: PRODUCT_API_BASE_URL,
  withCredentials: true, // needed for HTTP-only cookie auth
  timeout: 10000,        // 10s timeout
});

// Optional: interceptors for logging
ProductAPI.interceptors.request.use(
  (config) => {
    console.log("[ProductAPI] Request:", config.method.toUpperCase(), config.url);
    return config; 
  },
  (error) => Promise.reject(error)
);

ProductAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[ProductAPI] Response error:", error.message);
    return Promise.reject(error);
  }
);

export default ProductAPI;

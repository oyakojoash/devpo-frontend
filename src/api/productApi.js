import axios from "axios";

// Choose backend depending on environment
export const PRODUCT_API_BASE_URL ="http://localhost:10002"       // LOCAL SERVER
    

console.log("🌍 Product API Base URL:", PRODUCT_API_BASE_URL);

const ProductAPI = axios.create({
  baseURL: PRODUCT_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Optional logging interceptors
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

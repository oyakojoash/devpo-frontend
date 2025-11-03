import axios from 'axios';

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // Local backend
    : "https://devpo-backend-production.up.railway.app"; // Production backend


const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Export base URL for image construction
export const API_BASE_URL = baseURL;

export default API;

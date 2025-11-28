import axios from 'axios';

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"           // LOCAL SERVER
    : "https://devpo-backend-production.up.railway.app";  // PRODUCTION SERVER


const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Export base URL for image construction
export const API_BASE_URL = baseURL;

export default API;

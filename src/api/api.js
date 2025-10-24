import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://devpo-backend-production.up.railway.app';
console.log("🌍 Axios Base URL:", baseURL);

const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Export base URL for image construction
export const API_BASE_URL = baseURL;

export default API;

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default API;
  
//"C:\Users\hp\Desktop\memo\proto1\frontend\src\api.js"
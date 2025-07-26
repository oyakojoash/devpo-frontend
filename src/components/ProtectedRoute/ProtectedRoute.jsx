// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api'; // ✅ Import centralized API base

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null); // null = loading, false = not logged in

  useEffect(() => {
    axios
      .get(`${API}/api/auth/me`, { withCredentials: true })
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Checking authentication...</div>;
  return auth ? children : <Navigate to="/login" />;
}

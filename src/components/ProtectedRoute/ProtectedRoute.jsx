// src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../api/api'

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get('/api/auth/me', { withCredentials: true });
        console.log("✅ Auth success");
        setAuth(true);
      } catch (err) {
        console.warn("❌ Auth failed:", err.response?.data || err.message);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  return auth ? children : <Navigate to="/login" replace />;
}

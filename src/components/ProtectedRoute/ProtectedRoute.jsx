// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api'; // ✅ this is correct
// centralized axios instance

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null); // null = loading, false = not logged in

  useEffect(() => {
    API.get('/auth/me') // ✅ just use the path relative to your baseURL
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Checking authentication...</div>;
  return auth ? children : <Navigate to="/login" />;
}

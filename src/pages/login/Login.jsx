import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api'; // ✅ import centralized backend URL

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const email = form.email.trim();
    const fullName = form.fullName.trim();
    const password = form.password;
    const phone = form.phone.trim();

    if (!validateEmail(email)) return setError('❌ Enter a valid email');
    if (!isLogin && !validatePassword(password))
      return setError('❌ Password must include uppercase, lowercase, number, and symbol');

    setLoading(true);

    // ✅ Use dynamic backend URL
    const url = isLogin
      ? `${API}/api/auth/login`
      : `${API}/api/auth/register`;

    const payload = isLogin
      ? { email, password }
      : { fullName, email, password, phone };

    try {
      await axios.post(url, payload, { withCredentials: true });

      if (isLogin) {
        setSuccess('✅ Login successful!');
        navigate('/account');
      } else {
        setSuccess('✅ Registered successfully. Please login.');
        setIsLogin(true);
      }

      setForm({ fullName: '', email: '', password: '', phone: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'blue',
                fontSize: '14px',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          {isLogin && (
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ color: 'blue', fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

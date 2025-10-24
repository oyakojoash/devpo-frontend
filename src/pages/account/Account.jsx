// src/pages/account/Account.jsx
import React, { useEffect, useState, useContext } from 'react';
import './Account.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../../api/api'
import { UserContext } from '../../context/UserContext';

export default function Account() {
  const { user, setUser } = useContext(UserContext); // ✅ Use global user context
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const navigate = useNavigate();

  // ✅ Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // ✅ Redirect to login if user is null (not authenticated)
  useEffect(() => {
    if (user === null) {
      setMsg({ error: '⚠️ Session expired. Please login.', success: '' });
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Save profile with cookie
  const handleSave = async () => {
    setLoading(true);
    setMsg({ error: '', success: '' });
    try {
      await API.put('/api/user/me', form, { withCredentials: true });
      // ✅ Update global user state with new data
      setUser({ ...user, ...form });
      setMsg({ success: '✅ Profile updated', error: '' });
      setEditMode(false);
    } catch (err) {
      setMsg({ error: err.response?.data?.message || '❌ Update failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update password with cookie
  const handlePasswordUpdate = async () => {
    setLoading(true);
    setMsg({ error: '', success: '' });
    try {
      const res = await API.put('/api/user/password', passwords, { withCredentials: true });
      setMsg({ success: res.data.message, error: '' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ error: err.response?.data?.message || '❌ Password change failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout with cookie
  const handleLogout = async () => {
    try {
      await API.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null); // ✅ Clear global user state
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // ✅ Even if logout fails, clear user state locally
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) return <div className="account-container">Loading account...</div>;

  return (
    <div className="account-container">
      <h2>Account</h2>

      {msg.error && <p className="error-msg">{msg.error}</p>}
      {msg.success && <p className="success-msg">{msg.success}</p>}

      <div className="account-box">
        <label>Full Name</label>
        {editMode ? (
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
        ) : (
          <p>{user.fullName}</p>
        )}

        <label>Email</label>
        {editMode ? (
          <input type="email" name="email" value={form.email} onChange={handleChange} disabled />
        ) : (
          <p>{user.email}</p>
        )}

        <label>Phone</label>
        {editMode ? (
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        ) : (
          <p>{user.phone || '—'}</p>
        )}

        <div className="account-actions">
          {editMode ? (
            <>
              <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      <div className="account-box">
        <h3>Change Password</h3>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
        />
        <button onClick={handlePasswordUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
         <Link to="/account/orders" className="orders-button">
        View My Orders
       </Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h2>For any inquiries, please contact this email: <a href="mailto:dvepo1041@gmail.com">dvepo1041@gmail.com</a></h2>
    </div>
  );
}

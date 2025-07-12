import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Account.css';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          withCredentials: true,
        });
        setUser(res.data);
        setForm({ fullName: res.data.fullName, email: res.data.email });
      } catch (err) {
        setMsg({ error: '⚠️ Session expired. Please login.', success: '' });
        setTimeout(() => navigate('/login'), 1500);
      }
    }
    fetchUser();
  }, [navigate]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    setMsg({ error: '', success: '' });
    try {
      const res = await axios.put('http://localhost:5000/api/users/me', form, {
        withCredentials: true,
      });
      setUser(res.data);
      setMsg({ success: '✅ Profile updated', error: '' });
      setEditMode(false);
    } catch (err) {
      setMsg({ error: err.response?.data?.message || '❌ Update failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordUpdate = async () => {
    setLoading(true);
    setMsg({ error: '', success: '' });
    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/password',
        passwords,
        { withCredentials: true }
      );
      setMsg({ success: res.data.message, error: '' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ error: err.response?.data?.message || '❌ Password change failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      window.location.href = '/login';
    } catch (err) {
      setMsg({ error: '❌ Logout failed', success: '' });
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
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        ) : (
          <p>{user.email}</p>
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
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

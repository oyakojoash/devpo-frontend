import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🔒 Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

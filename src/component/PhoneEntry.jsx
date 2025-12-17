// PhoneEntry.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhoneEntry = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const saudiRegex = /^\9665\d{8}$/;
    if (!saudiRegex.test(phone)) {
      setError('Please enter a valid Saudi Arabia mobile number (e.g., 9665xxxxxxxx)');
      return;
    }

    try {
      const response = await axios.post(
        '/api/ValidatePhoneNumber/Add phone', 
        { phone }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('OTP sent successfully!');
      setTimeout(() => {navigate('/code', { state: { phone } });
}, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="card p-4 mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Enter Saudi Arabia Phone Number</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9665xxxxxxxx"
            required
          />
          <div className="invalid-feedback">Valid phone number is required.</div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default PhoneEntry;

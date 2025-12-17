import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CodeEntry = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
const location = useLocation();
const phone = location.state.phone;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      
      const response = await axios.post(
        'https://prototype.runasp.net/api/ValidatePhoneNumber/Verify OTP', 
        {
          phone,
          otp: parseInt(otp, 10), 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Code verified successfully!');
      
      setTimeout(() => {navigate('/success', { state: { phone } });
}, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid code or phone number');
    }
  };

  return (
    <div className="card p-4 mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Enter 6-Digit Code</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Verification Code</label>
          <input
            type="text"
            className="form-control"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="xxxxxx"
            required
          />
          <div className="invalid-feedback">6-digit code is required.</div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary w-100">Verify Code</button>
      </form>
    </div>
  );
};

export default CodeEntry;

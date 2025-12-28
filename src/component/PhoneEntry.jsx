import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhoneEntry = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsValid(true);

    const saudiRegex = /^9665\d{8}$/;
    if (!saudiRegex.test(phone)) {
      setError('يرجى إدخال رقم هاتف سعودي صالح (مثال: 9665xxxxxxxx)');
      setIsValid(false);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'https://prototype.runasp.net/api/ValidatePhoneNumber/AddPhone',
        { phone },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess('تم إرسال البيانات، جارٍ انتظار التحقق من الجهاز الآخر...');
      setTimeout(() => {
        navigate('/success', { state: { phone } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إرسال البيانات');
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <style jsx>{`  
        .custom-card {
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s ease;
        }
        
        .custom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .form-control-custom {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          direction: ltr;
          text-align: center;
        }
        
        .form-control-custom:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
          outline: none;
        }
        
        .form-control-invalid {
          border-color: #dc3545;
          box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.15);
        }
        
        .btn-custom {
          border-radius: 12px;
          padding: 14px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        
        .btn-custom:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="custom-card p-5 animate__animated animate__fadeInUp" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="mb-5 text-center fw-bold" style={{ color: '#1a1a1a', fontSize: '1.8rem' }}>
          أدخل رقم الجوال
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="tel"
              className={`form-control-custom w-100 ${!isValid ? 'form-control-invalid' : ''}`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsValid(true);
                setError('');
              }}
              placeholder="9665xxxxxxxx"
              maxLength="12"
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 animate__animated animate__shakeX" style={{ backgroundColor: '#f8d7da' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success border-0 rounded-3 animate__animated animate__bounceIn" style={{ backgroundColor: '#d1edff' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-custom w-100 mt-3"
            disabled={loading}
            style={{ backgroundColor: '#007bff', border: 'none' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                جاري الإرسال...
              </>
            ) : (
              'إرسال رمز التحقق'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneEntry;
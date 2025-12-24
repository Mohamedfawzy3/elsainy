import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CodeEntry = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';

  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setIsValid(true);
    setError('');

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = pasted.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      setOtp(newOtp);
      setIsValid(true);
      setError('');
      inputsRef.current[Math.min(pasted.length - 1, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsValid(true);

    const code = otp.join('');
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      setIsValid(false);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'https://prototype.runasp.net/api/ValidatePhoneNumber/VerifyOTP',
        {
          phone,
          otp: parseInt(code, 10),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setSuccess('تم التحقق بنجاح!');
      setTimeout(() => {
        navigate('/success', { state: { phone } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'الرمز غير صحيح، يرجى المحاولة مرة أخرى');
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
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
        
        .otp-input {
          width: 58px;
          height: 68px;
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          transition: all 0.3s ease;
          background: #f8f9ff;
        }
        
        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 5px rgba(0, 123, 255, 0.15);
          background: white;
          outline: none;
        }
        
        .otp-input.invalid {
          border-color: #dc3545;
          box-shadow: 0 0 0 5px rgba(220, 53, 69, 0.15);
          background: #fff5f5;
        }
        
        .btn-custom {
          border-radius: 12px;
          padding: 16px;
          font-weight: 700;
          font-size: 1.15rem;
          transition: all 0.3s ease;
        }
        
        .btn-custom:hover {
          transform: translateY(-3px);
        }
      `}</style>

      <div className="custom-card p-5 animate__animated animate__fadeInUp" style={{ maxWidth: '460px', width: '100%' }}>
        <h2 className="mb-3 text-center fw-bold" style={{ color: '#1a1a1a', fontSize: '1.8rem' }}>
          أدخل رمز التحقق
        </h2>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.05rem' }}>
          تم إرسال الرمز إلى الجوال<br />
          <strong dir="ltr" className="text-primary">{phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</strong>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="d-flex justify-content-center gap-3 mb-5" dir="ltr" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                className={`otp-input ${!isValid ? 'invalid' : ''}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputsRef.current[index] = el)}
                maxLength="1"
                inputMode="numeric"
              />
            ))}
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 animate__animated animate__shakeX text-center" style={{ backgroundColor: '#f8d7da' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success border-0 rounded-3 animate__animated animate__bounceIn text-center" style={{ backgroundColor: '#d1edff' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-custom w-100 mt-4"
            disabled={loading || otp.join('').length !== 6}
            style={{ backgroundColor: '#007bff', border: 'none' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                جاري التحقق...
              </>
            ) : (
              'تأكيد الرمز'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeEntry;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          'https://prototype.runasp.net/api/ValidatePhoneNumber/Get User Data'
        );

        if (response.data?.userData) {
          const { colorCode, code } = response.data.userData;
          if (colorCode) setColor(colorCode);
          if (code) setCode(code);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [phone]);

  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

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

        .color-box {
          width: 140px;
          height: 140px;
          border-radius: 20px;
          margin: 0 auto 30px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.5s ease;
          animation: pulse 2s infinite alternate;
        }

        @keyframes pulse {
          0% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
          100% { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); }
        }

        .code-display {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 8px;
          color: #1a1a1a;
        }

        .success-icon {
          font-size: 4rem;
          color: #28a745;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="custom-card p-5 animate__animated animate__fadeInUp text-center" style={{ maxWidth: '450px', width: '100%' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل بياناتك...</p>
          </div>
        ) : (
          <>
            <div className="success-icon animate__animated animate__bounceIn">
              ✓
            </div>

            <h2 className="mb-4 fw-bold" style={{ fontSize: '2rem', color: '#28a745' }}>
              تم التحقق بنجاح!
            </h2>

            <div 
              className="color-box animate__animated animate__zoomIn"
              style={{ backgroundColor: rgbColor }}
            ></div>

            <h3 className="code-display mb-4 animate__animated animate__fadeIn animate__delay-1s">
              {code || '—'}
            </h3>

            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              تم التحقق من رقم الجوال بنجاح
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;